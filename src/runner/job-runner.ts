import {
  IMachineImage,
  InstanceClass,
  InstanceSize,
  InstanceType,
  LookupMachineImage,
  MachineImage,
} from "@aws-cdk/aws-ec2";
import { IRole } from "@aws-cdk/aws-iam";
import { AutoscalingConfiguration, DockerConfiguration, MachineConfiguration } from "../runner-configuration";
import { Construct, Stack } from "@aws-cdk/core";

/**
 * The runner EC2 instances configuration. If not set, the defaults will be used.
 * @link GitlabRunnerAutoscalingProps
 */
export interface GitlabRunnerAutoscalingJobRunnerProps {
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

export class GitlabRunnerAutoscalingJobRunner extends Construct {
  readonly gitlabToken: string;
  readonly gitlabUrl?: string;
  readonly instanceType?: InstanceType;
  readonly machineImage?: IMachineImage;
  /*  readonly role?: IRole;
  readonly limit?: number;
  readonly outputLimit?: number;
  readonly environment?: string[];
  readonly docker?: DockerConfiguration;
  readonly machine?: MachineConfiguration;
  readonly autoscaling?: AutoscalingConfiguration[];*/

  constructor(scope: Stack, id: string, props: GitlabRunnerAutoscalingJobRunnerProps) {
    super(scope, id);
    this.gitlabToken = props.gitlabToken;
    this.gitlabUrl = props.gitlabUrl || "https://gitlab.com";
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
    /*    this.role = props.role;
    this.limit = props.limit;
    this.outputLimit = props.outputLimit;
    this.environment = props.environment;
    this.docker = props.docker;
    this.machine = props.machine;
    this.autoscaling = props.autoscaling;*/
  }
}
