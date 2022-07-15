import { CheapVpc } from "@pepperize/cdk-vpc";
import { Annotations, Stack } from "aws-cdk-lib";
import { ISubnet, IVpc, SubnetSelection, SubnetType } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export interface NetworkProps {
  /**
   * If no existing VPC is provided, a default Vpc will be created.
   */
  readonly vpc?: IVpc;

  /**
   * The GitLab Runner's subnets. It should be either public or private. If more then subnet is selected, then the first found (private) subnet will be used.
   * @see https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ec2.SubnetSelection.html
   *
   * A network is considered private, if
   *  - tagged by 'aws-cdk:subnet-type'
   *  - doesn't route to an Internet Gateway (not public)
   *  - has an Nat Gateway
   */
  readonly subnetSelection?: SubnetSelection;
}

/**
 * Network settings for the manager and runners
 *
 *  All EC2 instances should belong to the same subnet, availability zone and vpc.
 */
export class Network extends Construct {
  readonly vpc: IVpc;
  readonly availabilityZone: string;
  readonly subnet: ISubnet;

  constructor(scope: Stack, id: string, props?: NetworkProps) {
    super(scope, id);

    this.vpc =
      props?.vpc ??
      new CheapVpc(scope, `Vpc`, {
        maxAzs: 1,
      });

    this.subnet = this.findSubnet(this.vpc, props?.subnetSelection);

    this.availabilityZone = this.subnet.availabilityZone;

    if (!this.hasPrivateSubnets()) {
      Annotations.of(this).addWarning(`No private network found in ${this.vpc.vpcId}, using public addresses.`);
    }
  }

  public hasPrivateSubnets(): boolean {
    return !!this.vpc.privateSubnets.length;
  }

  /**
   * Returns the first private or public subnet. Optionally filters by AZ.
   *
   * @exception Throws an error if no private or public is found.
   */
  private findSubnet(vpc: IVpc, subnetSelection?: SubnetSelection): ISubnet {
    const selectedSubnets = vpc.selectSubnets(
      subnetSelection || {
        subnetType: this.hasPrivateSubnets() ? SubnetType.PRIVATE_WITH_NAT : SubnetType.PUBLIC,
        availabilityZones: vpc.availabilityZones,
      }
    );

    const subnet = selectedSubnets.subnets.find(() => true);

    if (!subnet) {
      throw new Error(`Neither a private nor a public subnet is found in ${vpc.vpcId}`);
    }

    return subnet;
  }
}
