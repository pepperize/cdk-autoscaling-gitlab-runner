import { Stack, Tags } from "aws-cdk-lib";
import {
  IMachineImage,
  InstanceClass,
  InstanceSize,
  InstanceType,
  LookupMachineImage,
  MachineImage,
} from "aws-cdk-lib/aws-ec2";
import { CfnInstanceProfile, IRole, ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { IStringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { pascalCase } from "pascal-case";
import { RunnerConfiguration } from "../runner-configuration";

/**
 * The runner EC2 instances configuration. If not set, the defaults will be used.
 */

export interface GitlabRunnerAutoscalingJobRunnerProps {
  /**
   * The runner’s authentication token, which is obtained during runner registration. Not the same as the registration token.
   * @see https://docs.gitlab.com/ee/api/runners.html#register-a-new-runner
   */
  readonly token: IStringParameter;

  /**
   * The runner EC2 instances configuration. If not set, the defaults will be used.
   * @link RunnerConfiguration
   */
  readonly configuration: RunnerConfiguration;
  /**
   * Instance type for runner EC2 instances. It's a combination of a class and size.
   * @default InstanceType.of(InstanceClass.T3, InstanceSize.MICRO)
   */
  readonly instanceType?: InstanceType;
  /**
   * An Amazon Machine Image ID for the Runners EC2 instances. If empty the latest Ubuntu 20.04 focal will be looked up.
   *
   * Any operating system supported by Docker Machine's provisioner.
   *
   * @see https://cloud-images.ubuntu.com/locator/ec2/
   * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/tree/main/libmachine/provision
   */
  readonly machineImage?: IMachineImage;
  /**
   * Optionally pass an IAM role, that get's assigned to the EC2 runner instances via Instance Profile.
   */
  readonly role?: IRole;
}

export class GitlabRunnerAutoscalingJobRunner extends Construct {
  private static generateUniqueName(): string {
    return `gitlab-runner-${new Date().getTime().toString().toString()}${Math.floor(Math.random() * 100000)}`;
  }
  readonly configuration: RunnerConfiguration;
  readonly instanceType: InstanceType;
  readonly machineImage: IMachineImage;
  readonly role: IRole;
  readonly instanceProfile: CfnInstanceProfile;

  constructor(scope: Stack, id: string, props: GitlabRunnerAutoscalingJobRunnerProps) {
    super(scope, id);
    this.configuration = {
      ...props.configuration,
      token: props.configuration.token ?? props.token?.stringValue,
      name: props.configuration.name ?? GitlabRunnerAutoscalingJobRunner.generateUniqueName(),
    };
    this.instanceType = props.instanceType || InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);
    this.machineImage =
      props.machineImage ||
      MachineImage.genericLinux({
        [scope.region]: new LookupMachineImage({
          name: "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*",
          owners: ["099720109477"],
          filters: {
            architecture: ["x86_64"],
            "image-type": ["machine"],
            state: ["available"],
            "root-device-type": ["ebs"],
            "virtualization-type": ["hvm"],
          },
        }).getImage(scope).imageId,
      });
    this.role =
      props.role ||
      new Role(scope, `RunnersRoleFor${pascalCase(this.configuration.name!)}`, {
        assumedBy: new ServicePrincipal("ec2.amazonaws.com", {}),
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")],
      });
    this.instanceProfile = new CfnInstanceProfile(
      scope,
      `RunnersInstanceProfileFor${pascalCase(this.configuration.name!)}`,
      {
        roles: [this.role.roleName],
      }
    );

    Tags.of(this.instanceProfile).add("RunnersInstanceProfile", "RunnersInstanceProfile");

    Tags.of(this.role).add("RunnersRole", "RunnersRole");
  }
}
