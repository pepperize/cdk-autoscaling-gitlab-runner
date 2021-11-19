import { ISubnet, IVpc, SubnetType, Vpc } from "@aws-cdk/aws-ec2";
import { Construct, Stack } from "@aws-cdk/core";

export type NetworkProps = {
  vpc?: IVpc;
  availabilityZone?: string; // If not specified, the availability zone is a, it needs to be set to the same availability zone as the specified subnet, for example when the zone is 'eu-west-1b' it has to be 'b'.
  subnet?: ISubnet;
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
      new Vpc(scope, `GitlabRunnerVpc`, {
        maxAzs: 1,
        subnetConfiguration: [
          {
            name: `${scope.stackName}/GitlabRunnerVpc/GitlabRunnerSubnet`,
            cidrMask: 18,
            subnetType: SubnetType.PUBLIC,
          },
        ],
      });
    this.availabilityZone =
      props.availabilityZone ||
      props.subnet?.availabilityZone ||
      this.vpc.availabilityZones.find(() => true) ||
      `${scope.region}-a`;

    this.subnet =
      props.subnet ??
      this.vpc
        .selectSubnets({
          subnetType: SubnetType.PUBLIC,
          availabilityZones: [this.availabilityZone],
        })
        .subnets.find(() => true)!;
  }
}
