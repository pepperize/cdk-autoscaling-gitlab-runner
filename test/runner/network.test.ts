import { App, Stack } from "@aws-cdk/core";
import { GitlabRunnerStackProps } from "../../src/gitlab-runner-stack";
import { Network } from "../../src/runner/network";

const TEST_NAME = "network";

test(TEST_NAME, () => {
  const MOCK_APP = new App();
  const MOCK_STACK_PROPS: GitlabRunnerStackProps = {
    env: {
      account: "",
      region: "us-east-1",
    },
  };
  const MOCK_STACK = new Stack(
    MOCK_APP,
    `${TEST_NAME}-stack`,
    MOCK_STACK_PROPS
  );

  const network = new Network(MOCK_STACK, `${TEST_NAME}-network`);

  expect(network.availabilityZone).toBeDefined();
  expect(network.subnet.subnetId).toBeDefined();
  expect(network.vpc.vpcId).toBeDefined();
  expect(network.availabilityZone).toEqual(network.vpc.availabilityZones[0]);
  expect(network.availabilityZone).toEqual(network.subnet.availabilityZone);
  expect(network.vpc.availabilityZones[0]).toEqual(
    network.subnet.availabilityZone
  );
});
