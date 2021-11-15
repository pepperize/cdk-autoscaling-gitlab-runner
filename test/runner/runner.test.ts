import { SynthUtils } from "@aws-cdk/assert";
import { Vpc } from "@aws-cdk/aws-ec2";
import { App, Stack } from "@aws-cdk/core";
import { Runner } from "../../src/runner/runner";

test("runner", () => {
  const app = new App();

  const mockStack = new Stack(app, "MockStack", {
    env: {
      account: "0",
      region: "us-east-1",
    },
  });

  const mockVpcStack = new Stack(app, "VpcStack");
  const mockVpc = Vpc.fromVpcAttributes(mockVpcStack, "MyVpc", {
    vpcId: "vpc123",
    availabilityZones: ["az1"],
    publicSubnetIds: ["pub1"],
  });

  new Runner(mockStack, "Runner", {
    vpcIdToLookUp: mockVpc.vpcId,
    gitlabToken: "",
  });
  expect(SynthUtils.toCloudFormation(mockStack)).toMatchSnapshot();
});
