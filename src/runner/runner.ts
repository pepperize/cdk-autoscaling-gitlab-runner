import {
  AutoScalingGroup,
  IAutoScalingGroup,
  Signals,
} from "@aws-cdk/aws-autoscaling";
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
  IRole,
  ManagedPolicy,
  PolicyDocument,
  Role,
  ServicePrincipal,
} from "@aws-cdk/aws-iam";
import { IBucket } from "@aws-cdk/aws-s3";
import { Construct, Duration, Stack } from "@aws-cdk/core";
import {
  Configuration,
  DockerConfiguration,
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
 * A record of Region: string and AmiID: string
 */
export const managerAmiMap: Record<string, string> = {
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

/**
 * A record of Region: string and AmiID: string
 * @see {@link https://cloud-images.ubuntu.com/locator/ec2/}
 */
export const runnerAmiMap: Record<string, string> = {
  "eu-central-1": "ami-0a49b025fffbbdac6",
  "us-west-1": "ami-053ac55bdcfe96e85",
  "us-east-1": "ami-083654bd07b5da81d",
};

/**
 * Properties of the Gitlab Runner. You have to provide at least the GitLab's Runner's authentication token.
 */
export interface GitlabRunnerAutoscalingProps {
  /**
   * The GitLab Runner’s authentication token, which is obtained during runner registration.
   * @see {@link https://docs.gitlab.com/ee/api/runners.html#registration-and-authentication-tokens}
   */
  gitlabToken: string;

  /**
   * GitLab instance URL.
   * @default "https://gitlab.com"
   */
  gitlabUrl?: string;

  /**
   * The distributed GitLab runner S3 cache. Either pass an existing bucket or override default options.
   * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section}
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
    /**
     * An Amazon Machine Image ID for the Manager EC2 instance.
     */
    machineImage?: IMachineImage;
    /**
     * Instance type for manager EC2 instance. It's a combination of a class and size.
     * @default InstanceType.of(InstanceClass.T3, InstanceSize.NANO)
     */
    instanceType?: InstanceType;
    /**
     * A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance. You won't be able to ssh into an instance without the Key Pair.
     */
    keyPairName?: string;
  };
  runners?: {
    /**
     * Instance type for runner EC2 instances. It's a combination of a class and size.
     * @default InstanceType.of(InstanceClass.T3, InstanceSize.MICRO)
     */
    instanceType?: InstanceType;
    /**
     * An Amazon Machine Image ID for the Runners EC2 instances.
     */
    machineImage?: IMachineImage;
    /**
     * This defines the Docker Container parameters.
     * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section}
     *
     * @example
     * ```
     * {
     *   tls_verify: false,
     *   image: "docker:19.03.5",
     *   privileged: true,
     *   cap_add: ["CAP_SYS_ADMIN"],
     *   wait_for_services_timeout: 300,
     *   disable_cache: false,
     *   volumes: ["/certs/client", "/cache"],
     *   shm_size: 0,
     * }
     * ```
     */
    docker?: Partial<DockerConfiguration>;
    /**
     * The following parameters define the Docker Machine-based autoscaling feature.
     * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachine-section}
     *
     * @example
     * ```
     * {
     *   IdleCount: 0,
     *   IdleTime: 300,
     *   MaxBuilds: 20,
     *   MachineDriver: "amazonec2",
     *   MachineName: "gitlab-runner-%s",
     *   autoscaling: [],
     * };
     */
    machine?: Partial<MachineConfiguration>;
  };
}

/**
 * The Gitlab Runner autoscaling on EC2 by Docker Machine.
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
export class GitlabRunnerAutoscaling extends Construct {
  readonly network: Network;

  readonly cacheBucket: IBucket;

  readonly runners: {
    securityGroupName: string;
    securityGroup: ISecurityGroup;
    role: IRole;
    instanceProfile: CfnInstanceProfile;
    instanceType: InstanceType;
    machineImage: IMachineImage;
  };

  readonly manager: {
    securityGroup: ISecurityGroup;
    instanceType: InstanceType;
    machineImage: IMachineImage;
    autoScalingGroup: IAutoScalingGroup;
    role: IRole;
  };

  constructor(scope: Stack, id: string, props: GitlabRunnerAutoscalingProps) {
    super(scope, id);
    const {
      manager,
      cache,
      runners,
      network,
      gitlabToken,
    }: GitlabRunnerAutoscalingProps = props;

    /**
     * S3 Bucket for Runners' cache
     */
    this.cacheBucket =
      cache?.bucket || new Cache(scope, "Cache", cache?.options).bucket;

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
    const runnersSecurityGroup = new SecurityGroup(
      scope,
      "RunnersSecurityGroup",
      {
        securityGroupName: runnersSecurityGroupName,
        description: "Security group for GitLab Runners.",
        vpc: this.network.vpc,
      }
    );

    const runnersRole = new Role(scope, "RunnersRole", {
      assumedBy: ec2ServicePrincipal,
      managedPolicies: [ec2ManagedPolicyForSSM],
    });

    const runnersInstanceProfile = new CfnInstanceProfile(
      scope,
      "RunnersInstanceProfile",
      {
        roles: [runnersRole.roleName],
      }
    );

    const runnersInstanceType =
      runners?.instanceType ||
      InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);

    const runnersMachineImage =
      runners?.machineImage || MachineImage.genericLinux(runnerAmiMap);

    /**
     * GitLab Manager
     */
    const managerSecurityGroup = new SecurityGroup(
      scope,
      "ManagerSecurityGroup",
      {
        vpc: this.network.vpc,
        description: "Security group for GitLab Runners Manager.",
      }
    );
    managerSecurityGroup.connections.allowTo(
      runnersSecurityGroup,
      Port.tcp(22),
      "SSH traffic from Manager"
    );
    managerSecurityGroup.connections.allowTo(
      runnersSecurityGroup,
      Port.tcp(2376),
      "SSH traffic from Docker"
    );

    const managerInstanceType =
      runners?.instanceType ||
      InstanceType.of(InstanceClass.T3, InstanceSize.NANO);

    const managerMachineImage =
      runners?.machineImage || MachineImage.genericLinux(managerAmiMap);

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
              Action: [
                "ec2:RequestSpotInstances",
                "ec2:CancelSpotInstanceRequests",
              ],
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

    // configs
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
                instanceType: runnersInstanceType,
                machineImage: runnersMachineImage,
                securityGroupName: runnersSecurityGroupName,
                instanceProfile: runnersInstanceProfile,
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

    const managerAutoScalingGroup = new AutoScalingGroup(
      scope,
      "ManagerAutoscalingGroup",
      {
        vpc: this.network.vpc,
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
          availabilityZones: [this.network.availabilityZone],
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
      }
    );

    this.runners = {
      securityGroupName: runnersSecurityGroupName,
      securityGroup: runnersSecurityGroup,
      role: runnersRole,
      instanceProfile: runnersInstanceProfile,
      instanceType: runnersInstanceType,
      machineImage: runnersMachineImage,
    };

    this.manager = {
      securityGroup: managerSecurityGroup,
      instanceType: managerInstanceType,
      machineImage: managerMachineImage,
      autoScalingGroup: managerAutoScalingGroup,
      role: managerRole,
    };
  }
}
