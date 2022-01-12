import { AutoScalingGroup, IAutoScalingGroup, Signals } from "@aws-cdk/aws-autoscaling";
import {
  AmazonLinuxCpuType,
  AmazonLinuxEdition,
  AmazonLinuxGeneration,
  AmazonLinuxStorage,
  AmazonLinuxVirt,
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
  LookupMachineImage,
  MachineImage,
  Port,
  SecurityGroup,
  UserData,
} from "@aws-cdk/aws-ec2";
import { CfnInstanceProfile, IRole, ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { IBucket } from "@aws-cdk/aws-s3";
import { Construct, Duration, Stack } from "@aws-cdk/core";
import {
  AutoscalingConfiguration,
  ConfigurationMapper,
  DockerConfiguration,
  GlobalConfiguration,
  MachineConfiguration,
} from "../runner-configuration";
import { Cache, CacheProps } from "./cache";
import { Network, NetworkProps } from "./network";

/**
 * This is a AWS CDK Construct that may be used to deploy a GitLab runner with Docker executor and auto-scaling.
 *
 * @remarks
 * The `cdk-gitlab-runner` defines the {@link GitlabRunnerAutoscalingProps} interface and {@link GitlabRunnerAutoscaling} construct class,
 * which are used to provision a the runner.
 *
 * @packageDocumentation
 */

/**
 * Properties of the Gitlab Runner. You have to provide at least the GitLab's Runner's authentication token.
 */
export interface GitlabRunnerAutoscalingProps extends GlobalConfiguration {
  readonly cache?: GitlabRunnerAutoscalingCacheProps;

  /**
   * The network configuration for the Runner. If not set, the defaults will be used.
   * @link NetworkProps
   */
  readonly network?: NetworkProps;

  /**
   * The manager EC2 instance configuration. If not set, the defaults will be used.
   * @link GitlabRunnerAutoscalingManagerProps
   */
  readonly manager?: GitlabRunnerAutoscalingManagerProps;

  readonly runners?: GitlabRunnerAutoscalingRunnerProps[];
}

/**
 * The distributed GitLab runner S3 cache. Either pass an existing bucket or override default options.
 * @see https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section
 */
export interface GitlabRunnerAutoscalingCacheProps {
  /**
   * An existing S3 bucket used as runner's cache.
   */
  readonly bucket?: IBucket;

  /**
   * If no existing S3 bucket is provided, a S3 bucket will be created.
   */
  readonly options?: CacheProps;
}

export interface GitlabRunnerAutoscalingManagerProps {
  /**
   * An Amazon Machine Image ID for the Manager EC2 instance. If empty the latest Amazon 2 Image will be looked up.
   *
   * Should be RHEL flavor like Amazon Linux 2 with yum available for instance initialization.
   *
   * @see https://cloudinit.readthedocs.io/en/latest/
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-init.html
   */
  readonly machineImage?: IMachineImage;

  /**
   * Instance type for manager EC2 instance. It's a combination of a class and size.
   * @default InstanceType.of(InstanceClass.T3, InstanceSize.NANO)
   */
  readonly instanceType?: InstanceType;

  /**
   * A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance. You won't be able to ssh into an instance without the Key Pair.
   */
  readonly keyPairName?: string;
}

/**
 * The runner EC2 instances configuration. If not set, the defaults will be used.
 * @link GitlabRunnerAutoscalingProps
 */
export interface GitlabRunnerAutoscalingRunnerProps {
  /**
   * The GitLab Runner’s authentication token, which is obtained during runner registration.
   * @see https://docs.gitlab.com/ee/api/runners.html#registration-and-authentication-tokens
   */
  readonly gitlabToken: string;

  /**
   * GitLab instance URL.
   * @default "https://gitlab.com"
   */
  readonly gitlabUrl?: string;

  /**
   * Instance type for runner EC2 instances. It's a combination of a class and size.
   * @default InstanceType.of(InstanceClass.T3, InstanceSize.MICRO)
   */
  readonly instanceType?: InstanceType;

  /**
   * An Amazon Machine Image ID for the Runners EC2 instances. If empty the latest Ubuntu 20.04 focal will be looked up.
   *
   * Any operating system supported by Dcoker Machine's provisioner.
   *
   * @see https://cloud-images.ubuntu.com/locator/ec2/
   * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/tree/main/libmachine/provision
   */
  readonly machineImage?: IMachineImage;

  /**
   * Optionally pass an IAM role, that get's assigned to the EC2 runner instances.
   */
  readonly role?: IRole;
  /**
   * Limit how many jobs can be handled concurrently by this registered runner. 0 (default) means do not limit.
   * @default 10
   */
  readonly limit?: number;

  /**
   * Maximum build log size in kilobytes. Default is 4096 (4MB).
   * @default 52428800 (50GB)
   */
  readonly outputLimit?: number;

  /**
   * Append or overwrite environment variables.
   * @default ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"]
   */
  readonly environment?: string[];

  /**
   * Optional docker configuration
   */
  readonly docker?: DockerConfiguration;
  /**
   * Optional docker machine configuration
   */
  readonly machine?: MachineConfiguration;
  /**
   * Optional autoscaling configuration
   */
  readonly autoscaling?: AutoscalingConfiguration[];
}

/**
 * The Gitlab Runner autoscaling on EC2 by Docker Machine.
 *
 * @example <caption>Provisioning a basic Runner</caption>
 * const app = new cdk.App();
 * const stack = new cdk.Stack(app, "RunnerStack", {
 *   env: {
 *     account: "000000000000",
 *     region: "us-east-1",
 *   }
 * });
 *
 * new GitlabRunnerAutoscaling(scope, "GitlabRunner", {
 *   gitlabToken: "xxxxxxxxxxxxxxxxxxxx",
 * });
 */
export class GitlabRunnerAutoscaling extends Construct {
  readonly network: Network;

  readonly cacheBucket: IBucket;

  readonly runners: GitlabRunnerAutoscalingRunners[];

  readonly manager: GitlabRunnerAutoscalingManager;

  constructor(scope: Stack, id: string, props: GitlabRunnerAutoscalingProps) {
    super(scope, id);
    const { manager, cache, runners, network }: GitlabRunnerAutoscalingProps = props;

    /**
     * S3 Bucket for Runners' cache
     */
    this.cacheBucket = cache?.bucket || new Cache(scope, "Cache", cache?.options).bucket;

    /**
     * Network
     */
    this.network = new Network(scope, "Network", network);

    /**
     * IAM
     */
    const ec2ServicePrincipal = new ServicePrincipal("ec2.amazonaws.com", {});
    const ec2ManagedPolicyForSSM = ManagedPolicy.fromManagedPolicyArn(
      scope,
      "AmazonEC2RoleforSSM",
      "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM"
    );

    /**
     * GitLab Runners
     */
    const runnersSecurityGroupName = `${scope.stackName}-RunnersSecurityGroup`;
    const runnersSecurityGroup = new SecurityGroup(scope, "RunnersSecurityGroup", {
      securityGroupName: runnersSecurityGroupName,
      description: "Security group for GitLab Runners.",
      vpc: this.network.vpc,
    });

    const runnersRole =
      (runners && runners[0].role) ||
      new Role(scope, "RunnersRole", {
        assumedBy: ec2ServicePrincipal,
        managedPolicies: [ec2ManagedPolicyForSSM],
      });

    const runnersInstanceProfile = new CfnInstanceProfile(scope, "RunnersInstanceProfile", {
      roles: [runnersRole.roleName],
    });

    const runnersInstanceType =
      (runners && runners[0].instanceType) || InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);

    const runnersLookupMachineImage = new LookupMachineImage({
      name: "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*",
      owners: ["099720109477"],
      filters: {
        architecture: ["x86_64"],
        "image-type": ["machine"],
        state: ["available"],
        "root-device-type": ["ebs"],
        "virtualization-type": ["hvm"],
      },
    }).getImage(this);

    const runnersMachineImage: IMachineImage =
      (runners && runners[0].machineImage) ||
      MachineImage.genericLinux({
        [scope.region]: runnersLookupMachineImage.imageId,
      });

    /**
     * GitLab Manager
     */
    const managerSecurityGroup = new SecurityGroup(scope, "ManagerSecurityGroup", {
      vpc: this.network.vpc,
      description: "Security group for GitLab Runners Manager.",
    });
    managerSecurityGroup.connections.allowTo(runnersSecurityGroup, Port.tcp(22), "SSH traffic from Manager");
    managerSecurityGroup.connections.allowTo(runnersSecurityGroup, Port.tcp(2376), "SSH traffic from Docker");

    const managerInstanceType = manager?.instanceType || InstanceType.of(InstanceClass.T3, InstanceSize.NANO);

    const managerMachineImage =
      manager?.machineImage ||
      MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        edition: AmazonLinuxEdition.STANDARD,
        virtualization: AmazonLinuxVirt.HVM,
        storage: AmazonLinuxStorage.EBS,
        cpuType: AmazonLinuxCpuType.X86_64,
      });

    const managerRole = new Role(scope, "ManagerRole", {
      assumedBy: ec2ServicePrincipal,
      managedPolicies: [ec2ManagedPolicyForSSM],
      inlinePolicies: {
        Cache: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["s3:ListObjects*", "s3:GetObject*", "s3:DeleteObject*", "s3:PutObject*"],
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
              Action: ["ec2:CreateKeyPair", "ec2:DeleteKeyPair", "ec2:ImportKeyPair", "ec2:Describe*"],
              Resource: ["*"],
            },
            {
              Effect: "Allow",
              Action: ["ec2:CreateTags", "ssm:UpdateInstanceInformation"],
              Resource: ["*"],
              Condition: {
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
              Action: ["ec2:RequestSpotInstances", "ec2:CancelSpotInstanceRequests"],
              Resource: ["*"],
              Condition: {
                StringEqualsIfExists: {
                  "ec2:Region": `${scope.region}`,
                },
                ArnEqualsIfExists: {
                  "ec2:Vpc": `${this.network.vpc.vpcArn}`,
                },
              },
            },
            {
              Effect: "Allow",
              Action: ["ec2:RunInstances"],
              Resource: ["*"],
              Condition: {
                StringEquals: {
                  "ec2:InstanceType": [`${runnersInstanceType.toString()}`],
                  "ec2:InstanceProfile": `${runnersInstanceProfile.ref}`,
                },
              },
            },
            {
              Effect: "Allow",
              Action: ["ec2:TerminateInstances", "ec2:StopInstances", "ec2:StartInstances", "ec2:RebootInstances"],
              Resource: ["*"],
              Condition: {
                StringLike: {
                  "ec2:ResourceTag/Name": "*gitlab-runner-*",
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

    const userData = UserData.forLinux({});
    userData.addCommands(
      `yum update -y aws-cfn-bootstrap` // !/bin/bash -xe
    );

    const gitlabRunnerConfigRestartHandle = new InitServiceRestartHandle();
    gitlabRunnerConfigRestartHandle._addFile("/etc/gitlab-runner/config.toml");

    const rsyslogConfigRestartHandle = new InitServiceRestartHandle();
    rsyslogConfigRestartHandle._addFile("/etc/rsyslog.d/25-gitlab-runner.conf");

    /**
     * Config set keys
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-init.html#aws-resource-init-configsets
     */
    const REPOSITORIES = "repositories";
    const PACKAGES = "packages";
    const CONFIG = "config";
    const RESTART = "restart";

    const initConfig = CloudFormationInit.fromConfigSets({
      configSets: {
        default: [REPOSITORIES, PACKAGES, CONFIG, RESTART],
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
            "curl -L https://gitlab-docker-machine-downloads.s3.amazonaws.com/v0.16.2-gitlab.12/docker-machine-`uname -s`-`uname -m` > /tmp/docker-machine && install /tmp/docker-machine /usr/bin/docker-machine",
            //"curl -L https://github.com/docker/machine/releases/download/v0.16.2/docker-machine-`uname -s`-`uname -m` > /tmp/docker-machine && install /tmp/docker-machine /usr/bin/docker-machine",
            { key: "10-docker-machine" }
          ),
          InitCommand.shellCommand("gitlab-runner start", {
            key: "20-gitlab-runner-start",
          }),
        ]),
        [CONFIG]: new InitConfig([
          InitFile.fromString(
            "/etc/gitlab-runner/config.toml",
            ConfigurationMapper.withDefaults({
              globalConfiguration: {
                concurrent: props?.concurrent ?? 10,
                checkInterval: props?.checkInterval ?? 0,
                logFormat: props?.logFormat || "runner",
                logLevel: props?.logLevel || "info",
              },
              runnersConfiguration: (runners || []).map((runner) => {
                return {
                  ...runner,
                  machine: {
                    ...runner.machine,
                    machineOptions: {
                      ...runner.machine?.machineOptions,
                      instanceType: runnersInstanceType.toString(),
                      ami: runnersMachineImage.getImage(scope).imageId,
                      region: scope.region,
                      vpcId: this.network.vpc.vpcId,
                      zone: this.network.availabilityZone.slice(-1),
                      subnetId: this.network.subnet.subnetId,
                      securityGroup: `${runnersSecurityGroupName}`,
                      usePrivateAddress: true,
                      iamInstanceProfile: `${runnersInstanceProfile.ref}`,
                    },
                  },
                  cache: {
                    s3: {
                      serverAddress: `s3.${scope.urlSuffix}`,
                      bucketName: `${this.cacheBucket.bucketName}`,
                      bucketLocation: `${scope.region}`,
                    },
                  },
                };
              }),
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

    const managerAutoScalingGroup = new AutoScalingGroup(scope, "ManagerAutoscalingGroup", {
      vpc: this.network.vpc,
      vpcSubnets: {
        subnets: [this.network.subnet],
      },
      instanceType: managerInstanceType,
      machineImage: managerMachineImage,
      keyName: manager?.keyPairName,
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

    this.runners = [
      {
        securityGroupName: runnersSecurityGroupName,
        securityGroup: runnersSecurityGroup,
        role: runnersRole,
        instanceProfile: runnersInstanceProfile,
        instanceType: runnersInstanceType,
        machineImage: runnersMachineImage,
      },
    ];

    this.manager = {
      securityGroup: managerSecurityGroup,
      instanceType: managerInstanceType,
      machineImage: managerMachineImage,
      autoScalingGroup: managerAutoScalingGroup,
      role: managerRole,
    };
  }
}

export interface GitlabRunnerAutoscalingRunners {
  readonly securityGroupName: string;
  readonly securityGroup: ISecurityGroup;
  readonly role: IRole;
  readonly instanceProfile: CfnInstanceProfile;
  readonly instanceType: InstanceType;
  readonly machineImage: IMachineImage;
}

export interface GitlabRunnerAutoscalingManager {
  readonly securityGroup: ISecurityGroup;
  readonly instanceType: InstanceType;
  readonly machineImage: IMachineImage;
  readonly autoScalingGroup: IAutoScalingGroup;
  readonly role: IRole;
}
