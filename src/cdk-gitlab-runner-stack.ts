import { Signals } from "@aws-cdk/aws-autoscaling";
import {
  CfnEIP,
  CloudFormationInit,
  IMachineImage,
  InitCommand,
  InitConfig,
  InitFile,
  InitPackage,
  InitService,
  InitServiceRestartHandle,
  Instance,
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
import { Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { Construct, Duration, Stack, StackProps } from "@aws-cdk/core";

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

export interface GitlabRunnerStackProps extends StackProps {
  machineImage?: IMachineImage;
  cacheBucketName?: string; // the bucket where your cache should be kept
  cacheExpirationInDays?: number;
  availabilityZone?: string; // If not specified, the availability zone is a, it needs to be set to the same availability zone as the specified subnet, for example when the zone is 'eu-west-1b' it has to be 'b'
  vpcIdToLookUp: string;  // Your VPC ID to launch the instance in.
  vpcSubnet?: SubnetSelection;
  managerInstanceType?: InstanceType;
  managerKeyPairName?: string; // You won't be able to ssh into an instance without the Key Pair
  gitlabUrl?: string; // URL of your GitLab instance
  gitlabToken?: string; // RUNNER_TOKEN. Note this is different from the registration token used by `gitlab-runner register`
  gitlabRunnerInstanceType?: InstanceType;
  gitlabDockerImage?: string; // Define the default Docker image to be used by the child runners if it’s not defined in .gitlab-ci.yml
  gitlabMaxBuilds?: number; // Maximum job (build) count before machine is removed.
  /** About concurrent, limit and IdleCount: https://docs.gitlab.com/runner/configuration/autoscale.html#how-concurrent-limit-and-idlecount-generate-the-upper-limit-of-running-machines */
  gitlabLimit?: number; // Limits how many jobs can be handled concurrently by this specific token. 0 simply means don’t limit.
  gitlabMaxConcurrentBuilds?: number; // Limits how many jobs globally can be run concurrently. This is the most upper limit of number of jobs using all defined runners, local and autoscale.
  gitlabIdleCount?: number; // A value that generates a minimum amount of not used machines when the job queue is empty.
  gitlabIdleTime?: number; // A number of seconds. The machine is waiting for the next jobs, and if no one is executed, after the IdleTime period, the machine is removed
  gitlabOffPeakTimezone?: string;
  gitlabOffPeakIdleCount?: string;
  gitlabOffPeakIdleTime?: string;
  gitlabCheckInterval?: number;
  gitlabRunnerSpotInstance?: string;
  gitlabRunnerSpotInstancePrice?: string;
}

const defaultProps: Partial<GitlabRunnerStackProps> = {
  machineImage: MachineImage.genericLinux(managerAmiMap),
  cacheBucketName: "runnercache",
  cacheExpirationInDays: 0,
  availabilityZone: "a",
  vpcSubnet: { subnetType: SubnetType.PUBLIC }, // TODO: refactor this bs
  managerInstanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
  managerKeyPairName: undefined,
  gitlabUrl: "https://gitlab.com", 
  gitlabToken: undefined,
  gitlabRunnerInstanceType: InstanceType.of(
    InstanceClass.T2,
    InstanceSize.MICRO
  ),
  gitlabDockerImage: "alpine",
  gitlabMaxBuilds: 25,
  gitlabMaxConcurrentBuilds: 10,
  gitlabLimit: 20,
  gitlabIdleCount: 10,
  gitlabIdleTime: 300,
  gitlabOffPeakTimezone: "string",
  gitlabOffPeakIdleCount: "string",
  gitlabOffPeakIdleTime: "string",
  gitlabCheckInterval: 0,
  gitlabRunnerSpotInstance: "string",
  gitlabRunnerSpotInstancePrice: "string",
};

export class GitlabRunnerStack extends Stack {
  constructor(scope: Construct, id: string, props: GitlabRunnerStackProps) {
    super(scope, id, props);

    const {
      machineImage,
      cacheBucketName,
      cacheExpirationInDays,
      availabilityZone,
      vpcIdToLookUp,
      vpcSubnet,
      managerInstanceType,
      managerKeyPairName,
      gitlabUrl,
      gitlabToken,
      gitlabRunnerInstanceType,
      gitlabDockerImage,
      gitlabMaxBuilds,
      gitlabLimit,
      gitlabMaxConcurrentBuilds,
      gitlabIdleCount,
      gitlabIdleTime,
      gitlabOffPeakTimezone,
      gitlabOffPeakIdleCount,
      gitlabOffPeakIdleTime,
      gitlabCheckInterval,
      gitlabRunnerSpotInstance,
      gitlabRunnerSpotInstancePrice,
    }: GitlabRunnerStackProps = { ...defaultProps, ...props }; // assign defaults and reassign with props if defined

    /*
     * ####################################
     * ### S3 Bucket for Runners' cache ###
     * ####################################
     */

    /* Transformation cacheExpirationInDays into expirationDate */
    const today = new Date();
    today.setUTCHours(0,0,0,0); // Date must be at midnight GMT
    
    const cacheBucketExpirationDate = new Date();
    cacheBucketExpirationDate.setUTCHours(0,0,0,0); // Date must be at midnight GMT
    cacheBucketExpirationDate.setDate(today.getDate() + cacheExpirationInDays!);

    /* Enabled if not 0. If 0 - cache doesnt't expire. */
    const lifeCycleRuleEnabled = cacheExpirationInDays === 0;

    const cacheBucket = new Bucket(this, "GitlabRunnerCacheBucket", {
      lifecycleRules: [
        {
          enabled: lifeCycleRuleEnabled,
          expirationDate: cacheBucketExpirationDate,
        },
      ],
      encryption: BucketEncryption.KMS,
      bucketKeyEnabled: true,
    });

    /*
     * #############################
     * ### GitLab Runner Manager ###
     * #############################
     */

    const vpc = Vpc.fromLookup(this, "PepperizeVpc", {
      vpcId:
        vpcIdToLookUp,
    });

    /*
     * ManagerSecurityGroup:
     * Type: 'AWS::EC2::SecurityGroup
     */
    const managerSecurityGroup = new SecurityGroup(
      this,
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

    const managerRole = new Role(this, "ManagerRole", {
      assumedBy: ec2ServicePrincipal,
      managedPolicies: [
        ManagedPolicy.fromManagedPolicyArn(
          this,
          "AmazonEC2RoleforSSM",
          "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM"
        ),
      ],
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
                  "ec2:Region": `${this.region}`,
                  "ec2:InstanceType": `${gitlabRunnerInstanceType?.toString}`,
                },
                StringLike: {
                  "aws:RequestTag/Name": "*gitlab-docker-machine-*",
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
                  "ec2:InstanceType": `${gitlabRunnerInstanceType?.toString}`,
                  "ec2:Region": `${this.region}`,
                  "ec2:Tenancy": "default",
                },
                ArnEqualsIfExists: {
                  "ec2:Vpc": `arn:${this.partition}:ec2:${this.partition}:${this.account}:vpc/${vpc.vpcId}`,
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
                  "ec2:ResourceTag/Name": "*gitlab-docker-machine-*",
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
    const userData = UserData.forLinux({});
    userData.addCommands(
      `yum update -y aws-cfn-bootstrap`, // !/bin/bash -xe
      `/opt/aws/bin/cfn-init --stack '${this.stackName}' --region '${this.region}' --resource Manager --configsets default`, // Install the files and packages from the metadata
      `/opt/aws/bin/cfn-signal -e $? --stack '${this.region}' --region '${this.region}' --resource Manager` // Signal the status from cfn-init
    );

    const manager = new Instance(this, "Instance", {
      instanceType: managerInstanceType!,
      vpc: vpc,
      machineImage: machineImage!,
      userData: userData,
      keyName: managerKeyPairName,
      securityGroup: managerSecurityGroup,
      vpcSubnets: vpcSubnet,
    });
    manager.node.tryRemoveChild("InstanceProfile"); // Remove default InstanceProfile
    manager.instance.iamInstanceProfile =
      managerInstanceProfile.instanceProfileName; // Reference our custom managerInstanceProfile: InstanceProfile

    const cfnHupPackagesConfigSetRestartHandle = new InitServiceRestartHandle();
    cfnHupPackagesConfigSetRestartHandle._addFile("/etc/cfn/cfn-hup.conf");
    cfnHupPackagesConfigSetRestartHandle._addFile(
      "/etc/cfn/hooks.d/cfn-auto-reloader.conf"
    );

    const gitlabRunnerConfigConfigSetRestartHandle =
      new InitServiceRestartHandle();
    gitlabRunnerConfigConfigSetRestartHandle._addFile(
      "/etc/gitlab-runner/config.toml"
    );

    const rsyslogConfigConfigSetRestartHandle = new InitServiceRestartHandle();
    rsyslogConfigConfigSetRestartHandle._addFile(
      "/etc/rsyslog.d/25-gitlab-runner.conf"
    );

    // config sets
    const REPOSITORIES = "repositories"
    const PACKAGES = "packages"
    const CONFIG = "config"
    const INSTALL = "install"

    CloudFormationInit.fromConfigSets({
      configSets: {
        install: [REPOSITORIES, PACKAGES],
        config: [CONFIG],
        default: [INSTALL, CONFIG],
      },
      configs: {
        [REPOSITORIES]: new InitConfig([
          InitCommand.shellCommand(
            "curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | bash", // 10-gitlab-runner
            { key: "10-gitlab-runner" }
          ),
        ]),
        [PACKAGES]: new InitConfig([
          InitPackage.yum("docker"),
          InitPackage.yum("gitlab-runner"),
          InitPackage.yum("tzdata"),
          InitFile.fromString(
            "/etc/cfn/cfn-hup.conf",
            `
              [main]
              stack=${this.stackName}
              region=${this.region}
            `,
            { owner: "root", group: "root", mode: "root" }
          ),
          InitFile.fromString(
            "/etc/cfn/hooks.d/cfn-auto-reloader.conf",
            `
              [cfn-auto-reloader-hook]
              triggers=post.update
              path=Resources.Manager.Metadata.AWS::CloudFormation::Init
              action=/opt/aws/bin/cfn-init -v --stack ${this.stackName} --region ${this.region} --resource Manager --configsets default
              runas=root
            `
          ),
          InitCommand.shellCommand(
            "curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | bash", // 10-gitlab-runner
            { key: "10-gitlab-runner" }
          ),
          InitCommand.shellCommand(
            "gitlab-runner start", // 20-gitlab-runner-start
            { key: "20-gitlab-runner-start" }
          ),
          InitService.enable("cfn-hup", {
            enabled: true,
            ensureRunning: true,
            serviceRestartHandle: cfnHupPackagesConfigSetRestartHandle,
          }),
        ]),
        [CONFIG]: new InitConfig([
          InitFile.fromString(
            "/etc/gitlab-runner/config.toml",
            `
            concurrent = ${gitlabMaxConcurrentBuilds}
            check_interval = ${gitlabCheckInterval}
            [[runners]]
              name = "${this.stackName}"
              url = "${gitlabUrl}"
              token = "${gitlabToken}"
              executor = "docker+machine"
              limit = "${gitlabLimit}"
              environment = [
                "DOCKER_DRIVER=overlay2",
                "DOCKER_TLS_CERTDIR=/certs"
              ]
              [runners.docker]
                tls_verify = false
                image = "${gitlabDockerImage}"
                privileged = true
                disable_cache = false
                volumes = ["/certs/client", "/cache"]
                shm_size = 0
              [runners.cache]
                Type = "s3"
                Shared = true
              [runners.cache.s3]
                ServerAddress = "s3.${this.urlSuffix}"
                BucketName = "${cacheBucketName}"
                BucketLocation = "${this.region}"
              [runners.machine]
                IdleCount = ${gitlabIdleCount}
                IdleTime = ${gitlabIdleTime}
                MaxBuilds = ${gitlabMaxBuilds}
                MachineDriver = "amazonec2"
                MachineName = "gitlab-docker-machine-%s"
                MachineOptions = [
                  "amazonec2-instance-type=${gitlabRunnerInstanceType}",
                  "amazonec2-region=${this.region}",
                  "amazonec2-vpc-id=${vpc.vpcId}",
                  "amazonec2-zone=${availabilityZone}",
                  "amazonec2-subnet-id=${vpcSubnet.subnets[0].subnetId}",
                  "amazonec2-security-group=${
                    this.stackName
                  }-RunnersSecurityGroup",
                  "amazonec2-use-private-address=true",
                  "amazonec2-iam-instance-profile=${
                    runnersInstanceProfile.logicalId
                  }"
                  ${
                    gitlabRunnerSpotInstance
                      ? "amazonec2-request-spot-instance=true"
                      : ""
                  } 
                  ${
                    gitlabRunnerSpotInstance
                      ? `amazonec2-spot-price=${gitlabRunnerSpotInstancePrice}`
                      : ""
                  }
                ]
                OffPeakTimezone = "${gitlabOffPeakTimezone}"
                OffPeakPeriods = ["* * 0-8,18-23 * * mon-fri *", "* * * * * sat,sun *"]
                OffPeakIdleCount = ${gitlabOffPeakIdleCount}
                OffPeakIdleTime = ${gitlabOffPeakIdleTime}
            `,
            {
              owner: "gitlab-runner",
              group: "gitlab-runner",
              mode: "000600",
            }
          ),
          InitFile.fromString(
            "/etc/rsyslog.d/25-gitlab-runner.conf",
            `
            :programname, isequal, "gitlab-runner" /var/log/gitlab-runner.log
          `,
            {
              owner: "root",
              group: "root",
              mode: "000644",
            }
          ),
          InitService.enable("gitlab-runner", {
            ensureRunning: true,
            enabled: true,
            serviceRestartHandle: gitlabRunnerConfigConfigSetRestartHandle,
          }),
          InitService.enable("rsyslog", {
            ensureRunning: true,
            enabled: true,
            serviceRestartHandle: rsyslogConfigConfigSetRestartHandle,
          }),
        ]),
      },
    });

    Signals.waitForAll({
      // Line 884: CreationPolicy
      timeout: Duration.minutes(15),
    });

    /*
     * ManagerEIP:
     * Type: 'AWS::EC2::EIP'
     */
    new CfnEIP(this, "ManagerEIP", {
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
     * RunnersSecurityGroup:
     * Type: 'AWS::EC2::SecurityGroup'
     */
    const runnersSecurityGroup = SecurityGroup.fromSecurityGroupId(
      this,
      "RunnersSecurityGroup",
      managerSecurityGroup.securityGroupId
    );

    runnersSecurityGroup.connections.allowFrom(
      Peer.anyIpv4(),
      Port.tcp(22),
      "SSH traffic from Manager"
    );
    runnersSecurityGroup.connections.allowFrom(
      Peer.anyIpv4(),
      Port.tcp(2376),
      "SSH traffic from Docker"
    );
  }
}
