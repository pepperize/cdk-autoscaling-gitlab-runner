import { Capture, Template } from "@aws-cdk/assertions";
import { Vpc } from "@aws-cdk/aws-ec2";
import { App, Stack } from "@aws-cdk/core";
import { GitlabRunnerAutoscaling } from "../../src";

describe("GitlabRunnerAutoscaling", () => {
  it("Should match snapshot", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "MockStack", {
      env: {
        account: "0",
        region: "us-east-1",
      },
    });
    const vpc = Vpc.fromVpcAttributes(stack, "MyVpc", {
      vpcId: "vpc123",
      publicSubnetIds: ["pub1"],
      availabilityZones: ["us-east-1a"],
    });

    // When
    const runner = new GitlabRunnerAutoscaling(stack, "Runner", {
      network: {
        vpc: vpc,
      },
      gitlabToken: "",
    });

    // Then
    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();
    expect(runner.network.availabilityZone).toBe("us-east-1a");
  });

  it("Should have manager instance type", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "MockStack", {
      env: {
        account: "0",
        region: "us-east-1",
      },
    });
    const vpc = Vpc.fromVpcAttributes(stack, "MyVpc", {
      vpcId: "vpc123",
      publicSubnetIds: ["pub1"],
      availabilityZones: ["us-east-1a"],
    });

    // When
    new GitlabRunnerAutoscaling(stack, "Runner", {
      network: {
        vpc: vpc,
      },
      gitlabToken: "",
    });

    // Then
    const template = Template.fromStack(stack);
    const capture = new Capture();
    template.hasResourceProperties("AWS::AutoScaling::LaunchConfiguration", capture);
    expect(capture.asObject()).toMatchObject({ InstanceType: "t3.nano" });
  });
});
