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
import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import {
  Duration,
  RemovalPolicy,
  Construct,
  Stack
} from "@aws-cdk/core";

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
export interface RunnerProps {
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

const defaultProps: Partial<RunnerProps> = {
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

export class Runner extends Construct {
  constructor(scope: Stack, id: string, props: RunnerProps) {
    super(scope, id);

    const {
      managerMachineImage: managerMachineImageId,
      cacheBucketName,
      cacheExpirationInDays,
      availabilityZone,
      vpcIdToLookUp,
      vpcSubnets,
      managerInstanceType,
      managerKeyPairName,
      gitlabUrl,
      gitlabToken,
      gitlabRunnerInstanceType,
      gitlabDockerImage,
      gitlabRunnerMachineImage,
      gitlabMaxBuilds,
      gitlabLimit,
      gitlabMaxConcurrentBuilds,
      gitlabOffPeakIdleCount,
      gitlabOffPeakIdleTime,
      gitlabAutoscalingTimezone,
      gitlabAutoscalingIdleCount,
      gitlabAutoscalingIdleTime,
      gitlabCheckInterval,
      gitlabRunnerRequestSpotInstance,
      gitlabRunnerSpotInstancePrice,
    }: RunnerProps = { ...defaultProps, ...props }; // assign defaults and reassign with props if defined

    /*
     * ####################################
     * ### S3 Bucket for Runners' cache ###
     * ####################################
     */

    /* Transformation cacheExpirationInDays into expirationDate */
    const today = new Date();
    const cacheBucketExpirationDate = new Date();
    cacheBucketExpirationDate.setDate(today.getDate() + cacheExpirationInDays!);
    cacheBucketExpirationDate.setUTCHours(0, 0, 0, 0); // Date must be at midnight GMT

    /* Enabled if not 0. If 0 - cache doesnt't expire. */
    const lifeCycleRuleEnabled = cacheExpirationInDays === 0;
    const uniqueCacheBucketName =
      `${scope.stackName}-${cacheBucketName}-${scope.account}-${scope.region}`.toLocaleLowerCase();

    const cacheBucket = new Bucket(scope, "CacheBucket", {
      bucketName: uniqueCacheBucketName,
      lifecycleRules: [
        {
          enabled: lifeCycleRuleEnabled,
          expirationDate: cacheBucketExpirationDate,
        },
      ],
      encryption: BucketEncryption.KMS_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    /*
     * #############################
     * ### GitLab Runner Manager ###
     * #############################
     */

    const vpc = Vpc.fromLookup(scope, "PepperizeVpc", {
      vpcId: vpcIdToLookUp,
    });
    const vpcSubnetId =
      vpc.selectSubnets(vpcSubnets).subnetIds.find(() => true) || "";

    /*
     * ManagerSecurityGroup:
     * Type: 'AWS::EC2::SecurityGroup
     */
    const managerSecurityGroup = new SecurityGroup(
      scope,
      "ManagerSecurityGroup",
      {
        vpc: vpc,
        description: "Security group for GitLab Runners Manager.",
      }
    );
    managerSecurityGroup.connections.allowFrom(
      Peer.ipv4("0.0.0.0/0"),
      Port.tcp(22),
      "SSH traffic"
    );

    /*
     * ManagerRole:
     * Type: 'AWS::IAM::Role'
     */
    const ec2ServicePrincipal = new ServicePrincipal("ec2.amazonaws.com", {});
    const ec2ManagedPolicyForSSM = ManagedPolicy.fromManagedPolicyArn(
      scope,
      "AmazonEC2RoleforSSM",
      "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM"
    );

    /*
     * RunnersRole:
     * Type: 'AWS::IAM::Role'
     */

    const runnersRole = new Role(scope, "RunnersRole", {
      assumedBy: ec2ServicePrincipal,
      managedPolicies: [ec2ManagedPolicyForSSM],
    });

    /*
     * RunnersInstanceProfile:
     * Type: 'AWS::IAM::InstanceProfile'
     */
    const runnersInstanceProfile = new CfnInstanceProfile( // TODO: refactor this low level code
      scope,
      "RunnersInstanceProfile",
      {
        instanceProfileName: "RunnersInstanceProfile",
        roles: [runnersRole.roleName],
      }
    );

    const managerRole = new Role(scope, "ManagerRole", {
      assumedBy: ec2ServicePrincipal,
      managedPolicies: [ec2ManagedPolicyForSSM],
      inlinePolicies: {
        Cache: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: [
                "s3:ListObjects*",
                "s3:GetObject*",
                "s3:DeleteObject*",
                "s3:PutObject*",
              ],
              Resource: [`${cacheBucket.bucketArn}/*`],
            },
            {
              Effect: "Allow",
              Action: ["s3:ListBucket"],
              Resource: [`${cacheBucket.bucketArn}`],
            },
          ],
        }),
        Runners: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: [
                "ec2:CreateKeyPair",
                "ec2:DeleteKeyPair",
                "ec2:ImportKeyPair",
                "ec2:Describe*",
              ],
              Resource: ["*"],
            },
            {
              Effect: "Allow",
              Action: ["ec2:CreateTags", "ssm:UpdateInstanceInformation"],
              Resource: ["*"],
              Condition: {
                StringEquals: {
                  "ec2:Region": `${scope.region}`,
                  "ec2:InstanceType": `${gitlabRunnerInstanceType?.toString()}`,
                },
                StringLike: {
                  "aws:RequestTag/Name": "*gitlab-runner-*",
                },
                "ForAllValues:StringEquals": {
                  "aws:TagKeys": ["Name"],
                },
              },
            },
            {
              Effect: "Allow",
              Action: ["ec2:RunInstances", "ec2:RequestSpotInstances"],
              Resource: ["*"],
              Condition: {
                StringEqualsIfExists: {
                  "ec2:InstanceType": `${gitlabRunnerInstanceType?.toString()}`,
                  "ec2:Region": `${scope.region}`,
                  "ec2:Tenancy": "default",
                },
                ArnEqualsIfExists: {
                  "ec2:Vpc": `arn:${scope.partition}:ec2:${scope.region}:${scope.account}:vpc/${vpc.vpcId}`,
                  "ec2:InstanceProfile": `${runnersInstanceProfile.attrArn}`,
                },
              },
            },
            {
              Effect: "Allow",
              Action: [
                "ec2:TerminateInstances",
                "ec2:StopInstances",
                "ec2:StartInstances",
                "ec2:RebootInstances",
              ],
              Resource: ["*"],
              Condition: {
                StringLike: {
                  "ec2:ResourceTag/Name": "*gitlab-runner-*",
                },
                ArnEquals: {
                  "ec2:InstanceProfile": `${runnersInstanceProfile.attrArn}`,
                },
              },
            },
            {
              Effect: "Allow",
              Action: ["iam:PassRole"],
              Resource: [`${runnersRole.roleArn}`],
            },
          ],
        }),
      },
    });

    /* Manager:
     * Type: 'AWS::EC2::Instance'
     */
    const userData = UserData.forLinux({});
    userData.addCommands(
      `yum update -y aws-cfn-bootstrap` // !/bin/bash -xe
    );

    const cfnHupRestartHandle = new InitServiceRestartHandle();
    cfnHupRestartHandle._addFile("/etc/cfn/cfn-hup.conf");
    cfnHupRestartHandle._addFile("/etc/cfn/hooks.d/cfn-auto-reloader.conf");

    const gitlabRunnerConfigRestartHandle = new InitServiceRestartHandle();
    gitlabRunnerConfigRestartHandle._addFile("/etc/gitlab-runner/config.toml");

    const rsyslogConfigRestartHandle = new InitServiceRestartHandle();
    rsyslogConfigRestartHandle._addFile("/etc/rsyslog.d/25-gitlab-runner.conf");

    // configs
    const REPOSITORIES = "repositories";
    const PACKAGES = "packages";
    const CFN_HUP = "cfnHup";
    const CONFIG = "config";
    const RESTART = "restart";

    const initConfig = CloudFormationInit.fromConfigSets({
      configSets: {
        default: [REPOSITORIES, PACKAGES, CFN_HUP, CONFIG, RESTART],
      },
      configs: {
        [REPOSITORIES]: new InitConfig([
          InitCommand.shellCommand(
            "curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | bash",
            { key: "10-gitlab-runner" }
          ),
        ]),
        [PACKAGES]: new InitConfig([
          InitPackage.yum("docker"),
          InitPackage.yum("gitlab-runner"),
          InitPackage.yum("tzdata"),
          InitCommand.shellCommand(
            //"curl -L https://gitlab-docker-machine-downloads.s3.amazonaws.com/v0.16.2-gitlab.12/docker-machine-`uname -s`-`uname -m` > /tmp/docker-machine && install /tmp/docker-machine /usr/bin/docker-machine",
            "curl -L https://github.com/docker/machine/releases/download/v0.16.2/docker-machine-`uname -s`-`uname -m` > /tmp/docker-machine && install /tmp/docker-machine /usr/bin/docker-machine",
            { key: "10-docker-machine" }
          ),
          InitCommand.shellCommand("gitlab-runner start", {
            key: "20-gitlab-runner-start",
          }),
        ]),
        [CFN_HUP]: new InitConfig([
          InitFile.fromString(
            "/etc/cfn/cfn-hup.conf",
            `
[main]
stack=${scope.stackName}
region=${scope.region}
verbose=true
            `.trim(),
            {
              owner: "root",
              group: "root",
              mode: "000400",
              serviceRestartHandles: [cfnHupRestartHandle],
            }
          ),
          InitFile.fromString(
            "/etc/cfn/hooks.d/cfn-auto-reloader.conf",
            `
[cfn-auto-reloader-hook]
triggers=post.update
path=Resources.ManagerAutoscalingGroup.Metadata.AWS::CloudFormation::Init
action=/opt/aws/bin/cfn-init -v --stack ${scope.stackName} --region ${scope.region} --resource ManagerAutoscalingGroup --configsets default
runas=root
            `.trim(),
            { serviceRestartHandles: [cfnHupRestartHandle] }
          ),
          InitService.enable("cfn-hup", {
            enabled: true,
            ensureRunning: true,
            serviceRestartHandle: cfnHupRestartHandle,
          }),
        ]),
        [CONFIG]: new InitConfig([
          InitFile.fromString(
            "/etc/gitlab-runner/config.toml",
            `
concurrent = ${gitlabMaxConcurrentBuilds}
check_interval = ${gitlabCheckInterval}
[[runners]]
  name = "${scope.stackName}"
  url = "${gitlabUrl}"
  token = "${gitlabToken}"
  executor = "docker+machine"
  limit = ${gitlabLimit}
  output_limit = 52428800
  environment = [
    "DOCKER_DRIVER=overlay2",
    "DOCKER_TLS_CERTDIR=/certs"
  ]
  [runners.docker]
    tls_verify = false
    image = "${gitlabDockerImage}"
    privileged = true
    cap_add = ["CAP_SYS_ADMIN"]
    wait_for_services_timeout = 300
    disable_cache = false
    volumes = ["/certs/client", "/cache"]
    shm_size = 0
  [runners.cache]
    Type = "s3"
    Shared = true
  [runners.cache.s3]
    ServerAddress = "s3.${scope.urlSuffix}"
    BucketName = "${uniqueCacheBucketName}"
    BucketLocation = "${scope.region}"
  [runners.machine]
    IdleCount = ${gitlabOffPeakIdleCount}
    IdleTime = ${gitlabOffPeakIdleTime}
    MaxBuilds = ${gitlabMaxBuilds}
    MachineDriver = "amazonec2"
    MachineName = "gitlab-runner-%s"
    MachineOptions = [
      "amazonec2-instance-type=${gitlabRunnerInstanceType}",
      "amazonec2-ami=${gitlabRunnerMachineImage?.getImage(scope).imageId}",
      "amazonec2-region=${scope.region}",
      "amazonec2-vpc-id=${vpc.vpcId}",
      "amazonec2-zone=${availabilityZone}",
      "amazonec2-subnet-id=${vpcSubnetId}",
      "amazonec2-security-group=${scope.stackName}-RunnersSecurityGroup",
      "amazonec2-use-private-address=true",
      "amazonec2-iam-instance-profile=${
        runnersInstanceProfile.instanceProfileName
      }",
      "amazonec2-request-spot-instance=${gitlabRunnerRequestSpotInstance}",
      "amazonec2-spot-price=${gitlabRunnerSpotInstancePrice}"
    ]
    [[runners.machine.autoscaling]]
      Timezone = "${gitlabAutoscalingTimezone}"
      Periods = ["* * 11-23 * * mon-fri *"]
      IdleCount = ${gitlabAutoscalingIdleCount}
      IdleTime = ${gitlabAutoscalingIdleTime}
            `.trim(),
            {
              owner: "gitlab-runner",
              group: "gitlab-runner",
              mode: "000600",
            }
          ),
          InitFile.fromString(
            "/etc/rsyslog.d/25-gitlab-runner.conf",
            `:programname, isequal, "gitlab-runner" /var/log/gitlab-runner.log`,
            {
              owner: "root",
              group: "root",
              mode: "000644",
            }
          ),
          InitService.enable("gitlab-runner", {
            ensureRunning: true,
            enabled: true,
            serviceRestartHandle: gitlabRunnerConfigRestartHandle,
          }),
          InitService.enable("rsyslog", {
            ensureRunning: true,
            enabled: true,
            serviceRestartHandle: rsyslogConfigRestartHandle,
          }),
        ]),
        [RESTART]: new InitConfig([
          InitCommand.shellCommand("gitlab-runner restart", {
            key: "10-gitlab-runner-restart",
          }),
        ]),
      },
    });

    new AutoScalingGroup(scope, "ManagerAutoscalingGroup", {
      vpc: vpc,
      vpcSubnets: vpcSubnets,
      instanceType: managerInstanceType!,
      machineImage: managerMachineImageId!,
      keyName: managerKeyPairName,
      securityGroup: managerSecurityGroup,
      role: managerRole,
      userData: userData,
      init: initConfig,
      initOptions: {
        ignoreFailures: false,
      },
      maxCapacity: 1,
      minCapacity: 1,
      desiredCapacity: 1,
      signals: Signals.waitForCount(1, { timeout: Duration.minutes(15) }),
    });

    /*
     * ######################
     * ### GitLab Runners ###
     * ######################
     */

    /*
     * RunnersSecurityGroup:
     * Type: 'AWS::EC2::SecurityGroup'
     */
    const runnersSecurityGroup = new SecurityGroup(
      scope,
      "RunnersSecurityGroup",
      {
        securityGroupName: `${scope.stackName}-RunnersSecurityGroup`,
        description: "Security group for GitLab Runners.",
        vpc: vpc,
      }
    );

    runnersSecurityGroup.connections.allowFrom(
      managerSecurityGroup,
      Port.tcp(22),
      "SSH traffic from Manager"
    );
    runnersSecurityGroup.connections.allowFrom(
      managerSecurityGroup,
      Port.tcp(2376),
      "SSH traffic from Docker"
    );
  }
}
