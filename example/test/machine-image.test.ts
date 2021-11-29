import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { MachineImageStack } from "../src/machine-image";

describe("MachineImage", () => {
  it("Should set custom instance type", () => {
    const app = new App();
    const stack = new MachineImageStack(app, "MachineImageStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "0",
        region: "region",
      },
    });
    const template = SynthUtils.toCloudFormation(stack);

    expect(JSON.stringify(template)).toContain(`ami=ami-id`);

    expect(stack).toHaveResource("AWS::AutoScaling::AutoScalingGroup");
    expect(template).toMatchSnapshot();
  });
});
