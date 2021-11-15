import { AutoScalingGroup, Signals } from "@aws-cdk/aws-autoscaling";
import {
  CloudFormationInit,
  IMachineImage,
  InitCommand,
  InitConfig,
  InitFile,
  InitPackage,
  InitService,
  InitServiceRestartHandle,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  Peer,
  Port,
  SecurityGroup,
  SubnetSelection,
  SubnetType,
  UserData,
  Vpc,
} from "@aws-cdk/aws-ec2";
import {
  CfnInstanceProfile,
  ManagedPolicy,
  PolicyDocument,
  Role,
  ServicePrincipal,
} from "@aws-cdk/aws-iam";
import { BlockPublicAccess, Bucket, BucketEncryption, } from "@aws-cdk/aws-s3";
import {
  Construct,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "@aws-cdk/core";
import { Runner } from "./runner/runner";

export const managerAmiMap: Record<string, string> = {
  // Record<REGION, AMI_ID>
  "eu-north-1": "ami-d16fe6af",
  "ap-south-1": "ami-0889b8a448de4fc44",
  "eu-west-3": "ami-0451ae4fd8dd178f7",
  "eu-west-2": "ami-09ead922c1dad67e4",
  "eu-west-1": "ami-07683a44e80cd32c5",
  "ap-northeast-2": "ami-047f7b46bd6dd5d84",
  "ap-northeast-1": "ami-0f9ae750e8274075b",
  "sa-east-1": "ami-0669a96e355eac82f",
  "ca-central-1": "ami-03338e1f67dae0168",
  "ap-southeast-1": "ami-0b419c3a4b01d1859",
  "ap-southeast-2": "ami-04481c741a0311bbb",
  "eu-central-1": "ami-09def150731bdbcc2",
  "us-east-1": "ami-0de53d8956e8dcf80",
  "us-east-2": "ami-02bcbb802e03574ba",
  "us-west-1": "ami-0019ef04ac50be30f",
  "us-west-2": "ami-061392db613a6357b",
};
export const runnerAmiMap: Record<string, string> = {
  // Record<REGION, AMI_ID>
  // https://cloud-images.ubuntu.com/locator/ec2/
  "eu-central-1": "ami-0a49b025fffbbdac6",
  "us-west-1": "ami-053ac55bdcfe96e85",
  "us-east-1": "ami-083654bd07b5da81d",
};

/**
 * Documentation:
 * About concurrent, limit and IdleCount: https://docs.gitlab.com/runner/configuration/autoscale.html#how-concurrent-limit-and-idlecount-generate-the-upper-limit-of-running-machines
 * About autoscaling props: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections
 */
export interface GitlabRunnerStackProps extends StackProps {
  managerMachineImage?: IMachineImage; // An Amazon Machine Image ID for the Manager EC2 instance.
  cacheBucketName?: string; // The bucket where your cache should be kept.
  cacheExpirationInDays?: number; // Number of days the cache is stored before deletion. 0 simply means don't delete.
  availabilityZone?: string; // If not specified, the availability zone is a, it needs to be set to the same availability zone as the specified subnet, for example when the zone is 'eu-west-1b' it has to be 'b'.
  vpcIdToLookUp: string; // Your VPC ID to launch the instance in.
  vpcSubnets?: SubnetSelection; // TODO: find a good approach OR just refactor it to use subnetId.
  managerInstanceType?: InstanceType; // Instance type for manager EC2 instance. It's a combination of a class and size.
  managerKeyPairName?: string; // A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance. You won't be able to ssh into an instance without the Key Pair.
  gitlabUrl?: string; // URL of your GitLab instance.
  gitlabToken: string; // RUNNER_TOKEN. Note this is different from the registration token used by `gitlab-runner register`.
  gitlabRunnerInstanceType?: InstanceType; // Instance type for runner EC2 instances. It's a combination of a class and size.
  gitlabRunnerMachineImage?: IMachineImage; // An Amazon Machine Image ID for the Runners EC2 instances.
  gitlabDockerImage?: string; // Define the default Docker image to be used by the child runners if it’s not defined in .gitlab-ci.yml .
  gitlabMaxBuilds?: number; // Maximum job (build) count before machine is removed.
  gitlabLimit?: number; // Limits how many jobs can be handled concurrently by this specific token. 0 simply means don’t limit.
  gitlabMaxConcurrentBuilds?: number; // Limits how many jobs globally can be run concurrently. This is the most upper limit of number of jobs using all defined runners, local and autoscale.
  gitlabOffPeakIdleCount?: number; // Number of machines that need to be created and waiting in Idle state. A value that generates a minimum amount of not used machines when the job queue is empty.
  gitlabOffPeakIdleTime?: number; // Time (in seconds) for a machine to be in Idle state before it is removed.
  gitlabAutoscalingTimezone?: string; // A timezone string. https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections
  gitlabAutoscalingIdleCount?: number; // Number of machines that need to be created and waiting in Idle state. A value that generates a minimum amount of not used machines when the job queue is empty.
  gitlabAutoscalingIdleTime?: number; // Time (in seconds) for a machine to be in Idle state before it is removed.
  gitlabCheckInterval?: number; // The check_interval option defines how often the runner should check GitLab for new jobs, in seconds.
  gitlabRunnerRequestSpotInstance?: boolean; // Use or not to use the Amazon EC2 Spot instances.
  gitlabRunnerSpotInstancePrice?: number; // A maximum (bidding) price for a Spot instance. https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances
}

const defaultProps: Partial<GitlabRunnerStackProps> = {
  managerMachineImage: MachineImage.genericLinux(managerAmiMap),
  cacheBucketName: "runnercache",
  cacheExpirationInDays: 30,
  availabilityZone: "a",
  // vpcIdToLookUp: must be set by a user and can't have a default value
  vpcSubnets: { subnetType: SubnetType.PUBLIC }, // TODO: refactor this
  managerInstanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
  managerKeyPairName: undefined,
  gitlabUrl: "https://gitlab.com",
  // gitlabToken: must be set by a user and can't have a default value
  gitlabRunnerInstanceType: InstanceType.of(
    InstanceClass.T3,
    InstanceSize.MICRO
  ),
  gitlabDockerImage: "docker:19.03.5",
  gitlabRunnerMachineImage: MachineImage.genericLinux(runnerAmiMap),
  gitlabMaxBuilds: 10,
  gitlabMaxConcurrentBuilds: 10,
  gitlabLimit: 20,
  gitlabOffPeakIdleCount: 0,
  gitlabOffPeakIdleTime: 300,
  gitlabAutoscalingTimezone: "UTC",
  gitlabAutoscalingIdleCount: 1,
  gitlabAutoscalingIdleTime: 1800,
  gitlabCheckInterval: 0,
  gitlabRunnerRequestSpotInstance: true,
  gitlabRunnerSpotInstancePrice: 0.03,
};

export class GitlabRunnerStack extends Stack {
  constructor(scope: Construct, id: string, props: GitlabRunnerStackProps) {
    super(scope, id, props);
    new Runner(this, id,  { ...defaultProps, ...props });
  }
}
