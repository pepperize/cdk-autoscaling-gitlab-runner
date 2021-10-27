import {
  CfnEIP,
  IMachineImage,
  Instance,
  InstanceType,
  Peer,
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
import { Domain } from "domain";

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
    managerSecurityGroup.connections.allowFrom(
      Peer.ipv4('0.0.0.0/0'),
      Port.tcp(22),
      "SSH traffic"
    );

    /*
     * ManagerRole:
     * Type: 'AWS::IAM::Role'
     */
    const ec2ServicePrincipal = new ServicePrincipal("ec2.amazonaws.com", {});

    const managerRole = new Role(this, "ManagerRole", {
      assumedBy: ec2ServicePrincipal,
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
    const managerInstanceProfile = new CfnInstanceProfile( // TODO: refactor this low level code
      this,
      "ManagerInstanceProfile",
      {
        roles: [managerRole.roleName],
      }
    );

    /* Manager:
     * Type: 'AWS::EC2::Instance'
     */
    const manager = new Instance(this, "Instance", {
      // TODO: finish this, set the missing values
      instanceType: new InstanceType(props.instanceTypeIdentifier),
      vpc: props.vpc,
      machineImage: props.machineImage,
    });
    manager.node.tryRemoveChild("InstanceProfile"); // Remove default InstanceProfile
    manager.instance.iamInstanceProfile =
      managerInstanceProfile.instanceProfileName; // Reference our custom managerInstanceProfile: InstanceProfile

    /*
     * ManagerEIP:
     * Type: 'AWS::EC2::EIP'
     */
    const managerEip = new CfnEIP(this, "ManagerEIP", {
      // TODO: refactor this low level code
      domain: "vpc",
      instanceId: manager.instanceId,
    });

    /*
     * ######################
     * ### GitLab Runners ###
     * ######################
     */

    /*
     * RunnersRole:
     * Type: 'AWS::IAM::Role'
     */

    const runnersRole = new Role(this, "RunnersRole", {
      assumedBy: ec2ServicePrincipal,
    });

    /*
     * RunnersInstanceProfile:
     * Type: 'AWS::IAM::InstanceProfile'
     */
    const runnersInstanceProfile = new CfnInstanceProfile( // TODO: refactor this low level code
      this,
      "RunnersInstanceProfile",
      {
        roles: [runnersRole.roleName],
      }
    );

    /*
     * RunnersSecurityGroup:
     * Type: 'AWS::EC2::SecurityGroup'
     */
    const runnersSecurityGroup = SecurityGroup.fromSecurityGroupId(this, "RunnersSecurityGroup", managerSecurityGroup.securityGroupId);

    runnersSecurityGroup.connections.allowFrom(
      Peer.anyIpv4(),
      Port.tcp(22),
      "SSH traffic from Manager",
    );
    runnersSecurityGroup.connections.allowFrom(
      Peer.anyIpv4(),
      Port.tcp(2376),
      "SSH traffic from Docker"
    );
    
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
