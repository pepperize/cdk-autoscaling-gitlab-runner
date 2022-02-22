import { App, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { SubnetFilter, Vpc } from "aws-cdk-lib/aws-ec2";
import { Network } from "../../src";

const stackProps = {
  env: {
    account: "123456789012",
    region: "us-east-1",
  },
};

describe("Network", () => {
  it("Should match snapshot when the network is being set", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "Stack", stackProps);
    const vpc = Vpc.fromVpcAttributes(stack, "MyVpc", {
      vpcId: "vpc",
      publicSubnetIds: ["public1", "public2"],
      availabilityZones: ["us-east-1a", "us-east-1b"],
    });

    // When
    new Network(stack, "cache", {
      vpc: vpc,
      subnetSelection: {
        subnetFilters: [SubnetFilter.availabilityZones(["us-east-1a"])],
      },
    });
    const template = Template.fromStack(stack);

    // Then
    expect(template).toMatchSnapshot();
  });

  it("Should have availabilityZone defined when the network is being set with defaults", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "Stack", stackProps);
    new Network(stack, "cache", {});

    // When
    const template = Template.fromStack(stack);

    // Then
    template.hasResourceProperties(
      "AWS::EC2::Subnet",
      Match.objectLike({
        AvailabilityZone: Match.anyValue(),
      })
    );
  });
});

test("network", () => {
  const app = new App();
  const stack = new Stack(app, `stack`);

  const network = new Network(stack, `network`);

  expect(network.availabilityZone).toBeDefined();
  expect(network.subnet.subnetId).toBeDefined();
  expect(network.vpc.vpcId).toBeDefined();
  expect(network.availabilityZone).toEqual(network.vpc.availabilityZones[0]);
  expect(network.availabilityZone).toEqual(network.subnet.availabilityZone);
  expect(network.vpc.availabilityZones[0]).toEqual(network.subnet.availabilityZone);
});
