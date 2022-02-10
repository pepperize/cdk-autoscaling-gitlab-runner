import { App, Stack } from "aws-cdk-lib";
import { Capture, Template } from "aws-cdk-lib/assertions";
import { Vpc } from "aws-cdk-lib/aws-ec2";
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
      runners: [
        {
          token: "token",
          name: "runner-one",
        },
        {
          token: "tokentwo",
        },
      ],
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
      runners: [
        {
          token: "token",
          name: "runner-one",
        },
      ],
    });

    // Then
    const template = Template.fromStack(stack);
    const capture = new Capture();
    template.hasResourceProperties("AWS::AutoScaling::LaunchConfiguration", capture);
    expect(capture.asObject()).toMatchObject({ InstanceType: "t3.nano" });
  });

  it("Should have multiple runner configuration", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "MockStack", {
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // When
    new GitlabRunnerAutoscaling(stack, "Runner", {
      runners: [
        {
          token: "token",
          name: "runner-one",
        },
        {
          token: "tokentwo",
          name: "runner-two",
        },
      ],
    });

    // Then
    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();
  });
});
