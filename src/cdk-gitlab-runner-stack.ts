import {
  IMachineImage,
  Instance,
  InstanceType,
  Port,
  Protocol,
  SecurityGroup,
  Vpc,
} from "@aws-cdk/aws-ec2";
import {
  CfnInstanceProfile,
  ManagedPolicy,
  PolicyDocument,
  Role,
  ServicePrincipal,
} from "@aws-cdk/aws-iam";
import { Bucket, BucketEncryption, LifecycleRule } from "@aws-cdk/aws-s3";
import {
  BucketDeployment,
  ServerSideEncryption,
} from "@aws-cdk/aws-s3-deployment";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

export interface GitlabRunnerStackProps extends StackProps {
  instanceTypeIdentifier: string;
  vpc: Vpc;
  machineImage: IMachineImage;
  /** These props come from "Parameters:" from runner.yml CFN template */
  cacheBucketName: string;
  cacheExpirationInDays: number;
  availabilityZone: any; // TODO: Provide some type
  subnetId: any; // TODO: Provide some type
  managerImageId: any; // TODO: Provide some type
  managerInstanceType: any; // TODO: Provide some type
  managerKeyPair: any; // TODO: Provide some type
  gitlabUrl: any; // TODO: Provide some type
  gitlabToken: any; // TODO: Provide some type
  gitlabRunnerInstanceType: any; // TODO: Provide some type
  gitlabDockerImage: any; // TODO: Provide some type
  gitlabMaxBuilds: any; // TODO: Provide some type
  gitlabMaxConcurrentBuilds: any; // TODO: Provide some type
  gitlabIdleCount: any; // TODO: Provide some type
  gitlabIdleTime: any; // TODO: Provide some type
  gitlabOffPeakTimezone: any; // TODO: Provide some type
  gitlabOffPeakIdleCount: any; // TODO: Provide some type
  gitlabOffPeakIdleTime: any; // TODO: Provide some type
  gitlabCheckInterval: any; // TODO: Provide some type
  gitlabRunnerSpotInstance: any; // TODO: Provide some type
  gitlabRunnerSpotInstancePrice: any; // TODO: Provide some type
}

export class GitlabRunnerStack extends Stack {
  private cacheBucketExpirationDate: Date;
  constructor(scope: Construct, id: string, props: GitlabRunnerStackProps) {
    super(scope, id, props);

    /*
     * #############################
     * ### GitLab Runner Manager ###
     * #############################
     */
    /*
     * ManagerSecurityGroup:
     * Type: 'AWS::EC2::SecurityGroup
     */
    const managerSecurityGroup = new SecurityGroup(
      this,
      "ManagerSecurityGroup",
      {
        vpc: props.vpc,
        securityGroupName: `${this.stackName}-ManagerSecurityGroup`,
        description: "Security group for GitLab Runners Manager.",
      }
    );
    managerSecurityGroup.addIngressRule(
      null, // TODO: Set this
      new Port({
        protocol: Protocol.TCP,
        stringRepresentation: null, // TODO: Set this
        fromPort: 22,
        toPort: 22,
      }),
      "SSH traffic"
    );
    /*
     * ManagerRole:
     * Type: 'AWS::IAM::Role'
     */
    const managerRole = new Role(this, "ManagerRole", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com", {}),
      managedPolicies: [
        ManagedPolicy.fromManagedPolicyArn(
          this,
          "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM",
          "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM"
        ),
      ],
      inlinePolicies: {
        Cache: PolicyDocument.fromJson({}), // TODO: Set this
        Runners: PolicyDocument.fromJson({}), // TODO: Set this
      },
    });

    /*
     * ManagerInstanceProfile:
     * Type: 'AWS::IAM::InstanceProfile'
     */
    const managerInstanceProfile = new CfnInstanceProfile(
      this,
      "ManagerInstanceProfile",
      {
        roles: [managerRole.roleName],
      }
    );

    /* Manager:
     * Type: 'AWS::EC2::Instance'
     */
    const instance = new Instance(this, "Instance", {
      // TODO: finish this, set the missing values
      instanceType: new InstanceType(props.instanceTypeIdentifier),
      vpc: props.vpc,
      machineImage: props.machineImage,
    });
    instance.node.tryRemoveChild("InstanceProfile"); // Remove default InstanceProfile
    instance.instance.iamInstanceProfile =
      managerInstanceProfile.instanceProfileName; // Reference our custom managerInstanceProfile: InstanceProfile
    /* ManagerEIP:
     * Type: 'AWS::EC2::EIP'
     */

    /*
     * ######################
     * ### GitLab Runners ###
     * ######################
     *
     * RunnersRole:
     * Type: 'AWS::IAM::Role'
     *
     * RunnersInstanceProfile:
     * Type: 'AWS::IAM::InstanceProfile'
     *
     * RunnersSecurityGroup:
     * Type: 'AWS::EC2::SecurityGroup'
     */

    /** EC2 Configuration */
    /* Manager instance */

    /*
     * ####################################
     * ### S3 Bucket for Runners' cache ###
     * ####################################
     */

    /* Transformation cacheExpirationInDays into expirationDate */
    const today = new Date().getDate();
    const cacheBucketExpirationDate = new Date();
    cacheBucketExpirationDate.setDate(today + props.cacheExpirationInDays);

    /* Enabled if not 0. If 0 - cache doesnt't expire. */
    const lifeCycleRuleEnabled = props.cacheExpirationInDays === 0;

    const cacheBucket = new Bucket(this, "GitlabRunnerCacheBucket", {
      bucketName: props.cacheBucketName,
      lifecycleRules: [
        {
          enabled: lifeCycleRuleEnabled,
          expirationDate: cacheBucketExpirationDate,
        },
      ],
      encryption: BucketEncryption.KMS,
      bucketKeyEnabled: true,
    });

    const cacheBucketDeployment = new BucketDeployment(
      this,
      "GitlabRunnerCacheBucketDeployment",
      {
        sources: null, // TODO: configure it
        destinationBucket: cacheBucket,
        serverSideEncryption: ServerSideEncryption.AES_256,
      }
    );
  }
}
