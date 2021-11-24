import {
  ISubnet,
  IVpc,
  SubnetSelection,
  SubnetType,
  Vpc,
} from "@aws-cdk/aws-ec2";
import { Annotations, Construct, Stack } from "@aws-cdk/core";

export type NetworkProps = {
  /**
   * If no existing VPC is provided, a default Vpc will be created.
   */
  vpc?: IVpc;

  /**
   * Customize subnets
   * @see {@link https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ec2.SubnetSelection.html}
   *
   * A network is considered private, if
   *  - tagged by 'aws-cdk:subnet-type'
   *  - doesn't route to an Internet Gateway (not public)
   *  - has an Nat Gateway
   */
  subnetSelection?: SubnetSelection;

  /**
   * The preferred availability zone for the GitLab Runner.
   *
   * If not specified, the first found availability zone will be picked. The selected subnets must be in that availability zone.
   */
  availabilityZone?: string;
};

/**
 * Network settings for the manager and runners
 *
 *  All EC2 instances should belong to the same subnet, availability zone and vpc.
 */
export class Network extends Construct {
  readonly vpc: IVpc;
  readonly availabilityZone: string;
  readonly subnet: ISubnet;

  constructor(scope: Stack, id: string, props: NetworkProps = {}) {
    super(scope, id);

    this.vpc =
      props.vpc ||
      new Vpc(scope, `Vpc`, {
        maxAzs: 1,
      });

    this.subnet = this.findSubnet(
      this.vpc,
      props.availabilityZone,
      props.subnetSelection
    );

    this.availabilityZone = this.findAvailabilityZone(
      this.subnet,
      props.availabilityZone
    );

    if (!this.hasPrivateSubnet(this.vpc)) {
      Annotations.of(this).addWarning(
        `No private network found in ${this.vpc.vpcId}, using public addresses.`
      );
    }
  }

  private hasPrivateSubnet(vpc: IVpc): boolean {
    return !!vpc.privateSubnets.length;
  }

  /**
   * Returns the first private or public subnet. Optionally filters by AZ.
   *
   * @exception Throws an error if no private or public is found.
   */
  private findSubnet(
    vpc: IVpc,
    availabilityZone?: string,
    subnetSelection?: SubnetSelection
  ): ISubnet {
    const filterByAZ = availabilityZone ? [availabilityZone] : undefined;

    const selectedSubnets = vpc.selectSubnets(
      subnetSelection || {
        subnetType: this.hasPrivateSubnet(vpc)
          ? SubnetType.PRIVATE_WITH_NAT
          : SubnetType.PUBLIC,
        availabilityZones: filterByAZ,
      }
    );

    const subnet = selectedSubnets.subnets.find(() => true);

    if (!subnet) {
      throw new Error(
        `Neither a private nor a public subnet is found in ${vpc.vpcId}`
      );
    }

    return subnet;
  }

  private findAvailabilityZone(
    subnet: ISubnet,
    availabilityZone?: string
  ): string {
    if (availabilityZone) {
      return availabilityZone;
    }

    return subnet.availabilityZone;
  }
}
