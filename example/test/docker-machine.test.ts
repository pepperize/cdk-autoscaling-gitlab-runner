import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { DockerMachineConfigurationStack } from "../src/docker-machine";

describe("DockerMachineConfiguration", () => {
  it("Should set docker machine properties", () => {
    const app = new App();
    const stack = new DockerMachineConfigurationStack(app, "DockerMachineConfigurationStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });
    const template = SynthUtils.toCloudFormation(stack);

    expect(JSON.stringify(template)).toContain(`cap_add = [ \\\"CAP_NET_ADMIN\\\" ]`);
    expect(JSON.stringify(template)).toContain(`cap_drop = [ \\\"CAP_CHOWN\\\" ]`);
    expect(JSON.stringify(template)).toContain(`privileged = false`);
    expect(JSON.stringify(template)).toContain(`pull_policy = \\"never\\"`);
    expect(JSON.stringify(template)).toContain(`wait_for_services_timeout = 600`);
    expect(JSON.stringify(template)).toContain(`IdleCount = 2`);
    expect(JSON.stringify(template)).toContain(`IdleTime = 3_000`);
    expect(JSON.stringify(template)).toContain(`MaxBuilds = 1`);

    expect(stack).toHaveResource("AWS::AutoScaling::AutoScalingGroup");
    expect(template).toMatchSnapshot();
  });
});
