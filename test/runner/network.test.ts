import { App, Stack } from "@aws-cdk/core";
import { Network } from "../../src/runner/network";

test("network", () => {
  const app = new App();
  const stack = new Stack(app, `stack`);

  const network = new Network(stack, `network`);

  expect(network.availabilityZone).toBeDefined();
  expect(network.subnet.subnetId).toBeDefined();
  expect(network.vpc.vpcId).toBeDefined();
  expect(network.availabilityZone).toEqual(network.vpc.availabilityZones[0]);
  expect(network.availabilityZone).toEqual(network.subnet.availabilityZone);
  expect(network.vpc.availabilityZones[0]).toEqual(
    network.subnet.availabilityZone
  );
});
