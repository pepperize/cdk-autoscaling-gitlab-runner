import {
  AmazonLinuxCpuType,
  AmazonLinuxEdition,
  AmazonLinuxGeneration,
  AmazonLinuxStorage,
  AmazonLinuxVirt,
  IMachineImage,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
} from "@aws-cdk/aws-ec2";
import { Construct, Stack } from "@aws-cdk/core";

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

  //readonly runners?: GitlabRunnerAutoscalingJobRunner[]
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

  constructor(scope: Stack, id: string, props?: GitlabRunnerAutoscalingManagerProps) {
    super(scope, id);
    this.machineImage =
      props?.machineImage ??
      MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        edition: AmazonLinuxEdition.STANDARD,
        virtualization: AmazonLinuxVirt.HVM,
        storage: AmazonLinuxStorage.EBS,
        cpuType: AmazonLinuxCpuType.X86_64,
      });
    this.instanceType = props?.instanceType ?? InstanceType.of(InstanceClass.T3, InstanceSize.NANO);
    this.keyPairName = props?.keyPairName;
  }
}
