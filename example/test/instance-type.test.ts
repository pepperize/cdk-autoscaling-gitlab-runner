import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { WithCustomInstanceTypeStack } from "../src/instance-type";

describe("InstanceType", () => {
  it("Should set custom instance type", () => {
    const app = new App();
    const stack = new WithCustomInstanceTypeStack(app, "InstanceTypeStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });
    const template = SynthUtils.toCloudFormation(stack);

    expect(JSON.stringify(template)).toContain(`instance-type=t3.small`);

    expect(stack).toHaveResource("AWS::AutoScaling::AutoScalingGroup");
    expect(template).toMatchSnapshot();
  });
});
