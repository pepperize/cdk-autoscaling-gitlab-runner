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
  MachineImage,
  UserData,
} from "@aws-cdk/aws-ec2";
import { IRole, ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { IBucket } from "@aws-cdk/aws-s3";
import { Construct, Stack } from "@aws-cdk/core";
import {
  GitlabRunnerAutoscalingManagerConfiguration,
  ConfigurationMapper,
  GlobalConfiguration,
} from "../runner-configuration";
import { GitlabRunnerAutoscalingJobRunner } from "./job-runner";
import { Network } from "./network";

export interface GitlabRunnerAutoscalingManagerProps extends GitlabRunnerAutoscalingManagerConfiguration {
  readonly globalConfiguration?: GlobalConfiguration;
  readonly runners: GitlabRunnerAutoscalingJobRunner[];
  readonly network: Network;
  readonly cacheBucket: IBucket;
  readonly role?: IRole;
  readonly runnersSecurityGroupName: string;
}

/**
 * Settings for the manager (coordinator)
 *
 *  Manager coordinates the placement of runner (job executor) instances
 */
export class GitlabRunnerAutoscalingManager extends Construct {
  readonly machineImage: IMachineImage;
  readonly instanceType: InstanceType;
  readonly keyPairName?: string;
  readonly runners: GitlabRunnerAutoscalingJobRunner[];
  readonly network: Network;
  readonly runnersSecurityGroupName: string;
  readonly role: IRole;
  readonly initConfig: CloudFormationInit;
  readonly userData: UserData;
  readonly cacheBucket: IBucket;
  readonly globalConfiguration: GlobalConfiguration;

  constructor(scope: Stack, id: string, props: GitlabRunnerAutoscalingManagerProps) {
    super(scope, id);
    this.globalConfiguration =
      props.globalConfiguration ||
      ({
        concurrent: 10,
        checkInterval: 0,
        logFormat: "runner",
        logLevel: "info",
      } as GlobalConfiguration);
    this.machineImage =
      props.machineImage ??
      MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        edition: AmazonLinuxEdition.STANDARD,
        virtualization: AmazonLinuxVirt.HVM,
        storage: AmazonLinuxStorage.EBS,
        cpuType: AmazonLinuxCpuType.X86_64,
      });
    this.instanceType = props.instanceType ?? InstanceType.of(InstanceClass.T3, InstanceSize.NANO);
    this.keyPairName = props.keyPairName;
    this.runners = props.runners;
    this.network = props.network;
    this.cacheBucket = props.cacheBucket;
    this.runnersSecurityGroupName = props.runnersSecurityGroupName;

    this.role =
      props.role ||
      new Role(scope, "ManagerRole", {
        assumedBy: new ServicePrincipal("ec2.amazonaws.com", {}),
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2RoleforSSM")],
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
                    "ec2:InstanceType": (this.runners || []).map((runner) => {
                      const runnersInstanceType =
                        (this.runners && runner.instanceType) || InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);
                      return runnersInstanceType.toString();
                    }),
                    "ForAllValues:StringEquals": {
                      "aws:TagKeys": ["InstanceProfile"],
                    },
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
                Resource: ["*"],
                Condition: {
                  "ForAllValues:StringEquals": {
                    "aws:TagKeys": ["RunnersRole"],
                  },
                },
              },
            ],
          }),
        },
      });

    this.userData = UserData.forLinux({});
    this.userData.addCommands(
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

    this.initConfig = CloudFormationInit.fromConfigSets({
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
              globalConfiguration: this.globalConfiguration,
              runnersConfiguration: this.runners.map((runner) => {
                return {
                  ...runner,
                  machine: {
                    ...runner.machine,
                    machineOptions: {
                      ...runner.machine?.machineOptions,
                      instanceType: runner.instanceType.toString(),
                      ami: runner.machineImage.getImage(scope).imageId,
                      region: scope.region,
                      vpcId: this.network.vpc.vpcId,
                      zone: this.network.availabilityZone.slice(-1),
                      subnetId: this.network.subnet.subnetId,
                      securityGroup: this.runnersSecurityGroupName,
                      usePrivateAddress: true,
                      iamInstanceProfile: runner.instanceProfile.ref,
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
  }
}
