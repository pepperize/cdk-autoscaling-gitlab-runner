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
  InstanceType,
  IVpc,
  Port,
  SecurityGroup,
  SubnetSelection,
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
import { IBucket } from "@aws-cdk/aws-s3";
import { Duration, Construct, Stack } from "@aws-cdk/core";
import { Cache, CacheProps } from "./cache";
import { Configuration } from "./configuration";
import {
  DockerConfiguration,
  MachineConfiguration,
} from "./configuration.types";

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

export interface RunnerProps {
  /**
   * The GitLab Runner’s authentication token, which is obtained during runner registration.
   * https://docs.gitlab.com/ee/api/runners.html#registration-and-authentication-tokens
   */
  gitlabToken: string;

  gitlabUrl?: string; // URL of your GitLab instance.

  /**
   * The distributed GitLab runner S3 cache. Either pass an existing bucket or override default options.
   * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section
   */
  cache?: {
    bucket?: IBucket;
    options?: CacheProps;
  };

  vpc?: {
    vpc?: IVpc;
    availabilityZone?: string; // If not specified, the availability zone is a, it needs to be set to the same availability zone as the specified subnet, for example when the zone is 'eu-west-1b' it has to be 'b'.
    vpcSubnets?: SubnetSelection; // TODO: find a good approach OR just refactor it to use subnetId.
  };

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

export class Runner extends Construct {
  constructor(scope: Stack, id: string, props: RunnerProps) {
    super(scope, id);
    const { manager, cache, runner, gitlabToken }: RunnerProps = props;
    /*
     * ####################################
     * ### S3 Bucket for Runners' cache ###
     * ####################################
     */
    const cacheBucket =
      cache?.bucket || new Cache(scope, "Cache", cache?.options).bucket;

    /*
     * #############################
     * ### VPC ###
     * #############################
     */
    const vpc = Vpc.fromLookup(scope, "PepperizeVpc", {
      vpcId: vpcIdToLookUp,
    });
    const vpcSubnetId =
      vpc.selectSubnets(vpcSubnets).subnetIds.find(() => true) || "";

    /*
     * #############################
     * ### IAM ###
     * #############################
     */
    const ec2ServicePrincipal = new ServicePrincipal("ec2.amazonaws.com", {});
    const ec2ManagedPolicyForSSM = ManagedPolicy.fromManagedPolicyArn(
      scope,
      "AmazonEC2RoleforSSM",
      "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM"
    );

    /*
     * ######################
     * ### GitLab Runners ###
     * ######################
     */

    const runnersSecurityGroupName = `${scope.stackName}-RunnersSecurityGroup`;
    const runnersSecurityGroup = new SecurityGroup(
      scope,
      "RunnersSecurityGroup",
      {
        securityGroupName: runnersSecurityGroupName,
        description: "Security group for GitLab Runners.",
        vpc: vpc,
      }
    );

    const runnersRole = new Role(scope, "RunnersRole", {
      assumedBy: ec2ServicePrincipal,
      managedPolicies: [ec2ManagedPolicyForSSM],
    });

    const runnersInstanceProfile = new CfnInstanceProfile( // TODO: refactor this low level code
      scope,
      "RunnersInstanceProfile",
      {
        instanceProfileName: "RunnersInstanceProfile",
        roles: [runnersRole.roleName],
      }
    );

    /*
     * #############################
     * ### GitLab Runner Manager ###
     * #############################
     */
    const managerSecurityGroup = new SecurityGroup(
      scope,
      "ManagerSecurityGroup",
      {
        vpc: vpc,
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
            Configuration.fromProps({
              scope: scope,
              gitlabToken: gitlabToken,
              cache: cacheBucket,
              vpc: {
                vpcId: vpcIdToLookUp,
                subnetId: vpcSubnetId,
                availabilityZone: availabilityZone!,
              },
              runner: {
                instanceType: gitlabRunnerInstanceType!,
                machineImage: gitlabRunnerMachineImage!,
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

    new AutoScalingGroup(scope, "ManagerAutoscalingGroup", {
      vpc: vpc,
      vpcSubnets: vpcSubnets,
      instanceType: managerInstanceType!,
      machineImage: managerMachineImage!,
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
  }
}
