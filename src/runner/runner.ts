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
  ISecurityGroup,
  MachineImage,
  Port,
  SecurityGroup,
  SubnetType,
  UserData,
} from "@aws-cdk/aws-ec2";
import {
  CfnInstanceProfile,
  IManagedPolicy,
  IRole,
  ManagedPolicy,
  PolicyDocument,
  Role,
  ServicePrincipal,
} from "@aws-cdk/aws-iam";
import { IPrincipal } from "@aws-cdk/aws-iam/lib/principals";
import { IBucket } from "@aws-cdk/aws-s3";
import { Construct, Duration, Stack } from "@aws-cdk/core";
import { Cache, CacheProps } from "./cache";
import { Configuration } from "./configuration";
import {
  DockerConfiguration,
  MachineConfiguration,
} from "./configuration.types";
import { Network, NetworkProps } from "./network";

/**
 * This is a AWS CDK Construct that may be used to deploy a GitLab runner with Docker executor and auto-scaling.
 *
 * @remarks
 * The `cdk-gitlab-runner` defines the {@link RunnerProps} interface and {@link Runner} construct class,
 * which are used to provision a the runner.
 *
 * @packageDocumentation
 */

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
 * Props of the Gitlab Runner
 * @beta
 */
export interface RunnerProps {
  /**
   * The GitLab Runner’s authentication token, which is obtained during runner registration.
   * https://docs.gitlab.com/ee/api/runners.html#registration-and-authentication-tokens
   */
  gitlabToken: string;

  /**
   * GitLab instance URL.
   * @default "https://gitlab.com"
   */
  gitlabUrl?: string;

  /**
   * The distributed GitLab runner S3 cache. Either pass an existing bucket or override default options.
   * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section
   */
  cache?: {
    /**
     * An existing S3 bucket used as runner's cache.
     */
    bucket?: IBucket;

    /**
     * If no existing S3 bucket is provided, a S3 bucket will be created.
     */
    options?: CacheProps;
  };

  network?: NetworkProps;

  manager?: {
    machineImage?: IMachineImage; // An Amazon Machine Image ID for the Manager EC2 instance.
    instanceType?: InstanceType; // Instance type for manager EC2 instance. It's a combination of a class and size.
    keyPairName?: string; // A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance. You won't be able to ssh into an instance without the Key Pair.
  };
  runner?: {
    instanceType?: InstanceType; // Instance type for runner EC2 instances. It's a combination of a class and size.
    machineImage?: IMachineImage; // An Amazon Machine Image ID for the Runners EC2 instances.
    docker?: Partial<DockerConfiguration>;
    machine?: Partial<MachineConfiguration>;
  };
}

/**
 * The Gitlab Runner
 * @alpha
 *
 * @example Provisioning a basic Runner
 * ```ts
 * const app = new cdk.App();
 * const stack = new cdk.Stack(app, "RunnerStack", {
 *   env: {
 *     account: "000000000000",
 *     region: "us-east-1",
 *   }
 * });
 *
 * new Runner(scope, "GitlabRunner", {
 *   gitlabToken: "xxxxxxxxxxxxxxxxxxxx",
 * });
 * ```
 */
export class Runner extends Construct {
  readonly network: Network;

  readonly cacheBucket: IBucket;
  readonly ec2ServicePrincipal: IPrincipal;
  readonly ec2ManagedPolicyForSSM: IManagedPolicy;

  readonly runnersSecurityGroupName: string;
  readonly runnersSecurityGroup: ISecurityGroup;
  readonly runnersRole: IRole;
  readonly runnersInstanceProfile: CfnInstanceProfile;
  readonly runnerInstanceType: InstanceType;
  readonly runnerMachineImage: IMachineImage;

  readonly managerSecurityGroup: ISecurityGroup;
  readonly managerInstanceType: InstanceType;
  readonly managerMachineImage: IMachineImage;
  readonly managerRole: IRole;

  readonly userData: UserData;
  readonly cfnHupRestartHandle: InitServiceRestartHandle;
  readonly gitlabRunnerConfigRestartHandle: InitServiceRestartHandle;
  readonly rsyslogConfigRestartHandle: InitServiceRestartHandle;
  readonly initConfig: CloudFormationInit;

  constructor(scope: Stack, id: string, props: RunnerProps) {
    super(scope, id);
    const { manager, cache, runner, network, gitlabToken }: RunnerProps = props;

    /** S3 Bucket for Runners' cache */
    this.cacheBucket =
      cache?.bucket || new Cache(scope, "Cache", cache?.options).bucket;

    /** Network */
    this.network = new Network(scope, "Network", network);

    /** IAM */
    this.ec2ServicePrincipal = new ServicePrincipal("ec2.amazonaws.com", {});
    this.ec2ManagedPolicyForSSM = ManagedPolicy.fromManagedPolicyArn(
      scope,
      "AmazonEC2RoleforSSM",
      "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM"
    );

    /** GitLab Runners */

    this.runnersSecurityGroupName = `${scope.stackName}-RunnersSecurityGroup`;
    this.runnersSecurityGroup = new SecurityGroup(
      scope,
      "RunnersSecurityGroup",
      {
        securityGroupName: this.runnersSecurityGroupName,
        description: "Security group for GitLab Runners.",
        vpc: this.network.vpc,
      }
    );

    this.runnersRole = new Role(scope, "RunnersRole", {
      assumedBy: this.ec2ServicePrincipal,
      managedPolicies: [this.ec2ManagedPolicyForSSM],
    });

    this.runnersInstanceProfile = new CfnInstanceProfile( // TODO: refactor this low level code
      scope,
      "RunnersInstanceProfile",
      {
        instanceProfileName: "RunnersInstanceProfile",
        roles: [this.runnersRole.roleName],
      }
    );

    this.runnerInstanceType =
      runner?.instanceType ||
      InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);

    this.runnerMachineImage =
      runner?.machineImage || MachineImage.genericLinux(runnerAmiMap);

    /*
     * #############################
     * ### GitLab Runner Manager ###
     * #############################
     */
    this.managerSecurityGroup = new SecurityGroup(
      scope,
      "ManagerSecurityGroup",
      {
        vpc: this.network.vpc,
        description: "Security group for GitLab Runners Manager.",
      }
    );
    this.managerSecurityGroup.connections.allowTo(
      this.runnersSecurityGroup,
      Port.tcp(22),
      "SSH traffic from Manager"
    );
    this.managerSecurityGroup.connections.allowTo(
      this.runnersSecurityGroup,
      Port.tcp(2376),
      "SSH traffic from Docker"
    );

    this.managerInstanceType =
      runner?.instanceType ||
      InstanceType.of(InstanceClass.T3, InstanceSize.NANO);

    this.managerMachineImage =
      runner?.machineImage || MachineImage.genericLinux(managerAmiMap);

    this.managerRole = new Role(scope, "ManagerRole", {
      assumedBy: this.ec2ServicePrincipal,
      managedPolicies: [this.ec2ManagedPolicyForSSM],
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
              Resource: [`${this.cacheBucket.bucketArn}/*`],
            },
            {
              Effect: "Allow",
              Action: ["s3:ListBucket"],
              Resource: [`${this.cacheBucket.bucketArn}`],
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
                  "ec2:InstanceType": `${this.runnerInstanceType.toString()}`,
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
                  "ec2:InstanceType": `${this.runnerInstanceType.toString()}`,
                  "ec2:Region": `${scope.region}`,
                  "ec2:Tenancy": "default",
                },
                ArnEqualsIfExists: {
                  "ec2:Vpc": `arn:${scope.partition}:ec2:${scope.region}:${scope.account}:vpc/${this.network.vpc.vpcId}`,
                  "ec2:InstanceProfile": `${this.runnersInstanceProfile.attrArn}`,
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
                  "ec2:InstanceProfile": `${this.runnersInstanceProfile.attrArn}`,
                },
              },
            },
            {
              Effect: "Allow",
              Action: ["iam:PassRole"],
              Resource: [`${this.runnersRole.roleArn}`],
            },
          ],
        }),
      },
    });

    /* Manager:
     * Type: 'AWS::EC2::Instance'
     */
    this.userData = UserData.forLinux({});
    this.userData.addCommands(
      `yum update -y aws-cfn-bootstrap` // !/bin/bash -xe
    );

    this.cfnHupRestartHandle = new InitServiceRestartHandle();
    this.cfnHupRestartHandle._addFile("/etc/cfn/cfn-hup.conf");
    this.cfnHupRestartHandle._addFile(
      "/etc/cfn/hooks.d/cfn-auto-reloader.conf"
    );

    this.gitlabRunnerConfigRestartHandle = new InitServiceRestartHandle();
    this.gitlabRunnerConfigRestartHandle._addFile(
      "/etc/gitlab-runner/config.toml"
    );

    this.rsyslogConfigRestartHandle = new InitServiceRestartHandle();
    this.rsyslogConfigRestartHandle._addFile(
      "/etc/rsyslog.d/25-gitlab-runner.conf"
    );

    // configs
    const REPOSITORIES = "repositories";
    const PACKAGES = "packages";
    const CFN_HUP = "cfnHup";
    const CONFIG = "config";
    const RESTART = "restart";

    this.initConfig = CloudFormationInit.fromConfigSets({
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
              serviceRestartHandles: [this.cfnHupRestartHandle],
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
            { serviceRestartHandles: [this.cfnHupRestartHandle] }
          ),
          InitService.enable("cfn-hup", {
            enabled: true,
            ensureRunning: true,
            serviceRestartHandle: this.cfnHupRestartHandle,
          }),
        ]),
        [CONFIG]: new InitConfig([
          InitFile.fromString(
            "/etc/gitlab-runner/config.toml",
            Configuration.fromProps({
              scope: scope,
              gitlabToken: gitlabToken,
              cache: this.cacheBucket,
              vpc: {
                vpcId: this.network.vpc.vpcId,
                subnetId: this.network.subnet.subnetId,
                availabilityZone: this.network.availabilityZone.slice(-1),
              },
              runner: {
                instanceType: this.runnerInstanceType,
                machineImage: this.runnerMachineImage,
                securityGroupName: this.runnersSecurityGroupName,
                instanceProfile: this.runnersInstanceProfile,
              },
              spot: {
                requestSpotInstance: true,
                spotPrice: 0.03,
              },
            }).toToml(),
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
            serviceRestartHandle: this.gitlabRunnerConfigRestartHandle,
          }),
          InitService.enable("rsyslog", {
            ensureRunning: true,
            enabled: true,
            serviceRestartHandle: this.rsyslogConfigRestartHandle,
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
      vpc: this.network.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
        availabilityZones: [this.network.availabilityZone],
      },
      instanceType: this.managerInstanceType,
      machineImage: this.managerMachineImage,
      keyName: manager?.keyPairName,
      securityGroup: this.managerSecurityGroup,
      role: this.managerRole,
      userData: this.userData,
      init: this.initConfig,
      initOptions: {
        ignoreFailures: false,
      },
      maxCapacity: 1,
      minCapacity: 1,
      desiredCapacity: 1,
      signals: Signals.waitForCount(1, { timeout: Duration.minutes(15) }),
    });
  }
}
