import { App, Stack } from "aws-cdk-lib";
import { Capture, Template } from "aws-cdk-lib/assertions";
import { InstanceClass, InstanceSize, InstanceType, Vpc } from "aws-cdk-lib/aws-ec2";
import { ParameterTier, ParameterType, StringParameter } from "aws-cdk-lib/aws-ssm";
import { GitlabRunnerAutoscaling, GitlabRunnerAutoscalingJobRunnerProps } from "../../src";

describe("GitlabRunnerAutoscaling", () => {
  it("Should match snapshot when the runner is being used", () => {
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
    const token = new StringParameter(stack, "imported-token", {
      parameterName: "/gitlab-runner/token",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    // When
    const runner = new GitlabRunnerAutoscaling(stack, "Runner", {
      concurrent: 10,
      checkInterval: 0,
      logFormat: "runner",
      logLevel: "info",
      network: {
        vpc: vpc,
      },
      runners: [
        {
          token: token,
          configuration: {
            name: "runner-one",
          },
        },
        {
          token: token,
          configuration: {
            name: "runner-two",
          },
        },
      ],
    });

    // Then
    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();
    expect(runner.network.availabilityZone).toBe("us-east-1a");
  });

  it("Should have manager instance type set when it's set through props", () => {
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
    const token = new StringParameter(stack, "imported-token", {
      parameterName: "/gitlab-runner/token",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    // When
    new GitlabRunnerAutoscaling(stack, "Runner", {
      network: {
        vpc: vpc,
      },
      runners: [
        {
          token: token,
          configuration: {
            name: "runner-one",
          },
        },
      ],
    });

    // Then
    const template = Template.fromStack(stack);
    const capture = new Capture();
    template.hasResourceProperties("AWS::AutoScaling::LaunchConfiguration", capture);
    expect(capture.asObject()).toMatchObject({ InstanceType: "t3.nano" });
  });

  it("Should have multiple runner configuration when it's set through props", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "MockStack", {
      env: {
        account: "0",
        region: "us-east-1",
      },
    });
    const token = new StringParameter(stack, "imported-token", {
      parameterName: "/gitlab-runner/token",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    /**
     * t3.medium unprivileged work hours 10-18:00, 30 min idle time, teardown after 20 jobs, 1 hot standby
     */
    const runner1: GitlabRunnerAutoscalingJobRunnerProps = {
      token: token,
      configuration: {
        name: "gitlab-runner1",
        machine: {
          maxBuilds: 20, // teardown after 20 jobs
          idleCount: 0, // no instances except for the periods that are set at the autoscaling configuration
          autoscaling: [
            {
              idleCount: 1, // 1 hot standby
              idleTime: 1800, // 30 min idle time
              periods: ["* * 10-18 * * *"], // work hours 10-18:00
            },
          ],
        },
        docker: {
          privileged: false, // unprivileged
        },
      },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM), // t3.medium
    };

    /**
     * t3.small unprivileged, work hours 13-17:00, 15 min idle time, teardown after 5 jobs
     */
    const runner2: GitlabRunnerAutoscalingJobRunnerProps = {
      token: token,
      configuration: {
        name: "gitlab-runner2",
        machine: {
          maxBuilds: 5, // teardown after 5 jobs
          idleCount: 0, // no instances except for the periods that are set at the autoscaling configuration
          autoscaling: [
            {
              periods: ["* * 13-17 * * *"], // work hours 13-17:00
              idleCount: 1, // 1 hot standby ?
              idleTime: 900, // 15 min idle time
            },
          ],
        },
        docker: {
          privileged: false, // unprivileged
        },
      },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL), // t3.medium
    };

    /**
     * t3.xlarge, privileged, no hot standby, teardown after 1 job
     */
    const runner3: GitlabRunnerAutoscalingJobRunnerProps = {
      token: token,
      configuration: {
        name: "gitlab-runner3",
        machine: {
          maxBuilds: 1, // teardown after 1 job
          idleCount: 0, // no hot standby
          autoscaling: [
            {
              idleCount: 0, // no hot standby
              periods: ["* * * * * *"], // always use this configuration
            },
          ],
        },
        // privileged by default
      },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.XLARGE), // t3.xlarge
    };

    // When
    new GitlabRunnerAutoscaling(stack, "Runner", {
      runners: [runner1, runner2, runner3],
    });

    // Then
    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();
    template.hasResourceProperties("AWS::AutoScaling::LaunchConfiguration", {});
    expect(JSON.stringify(template)).toMatch("gitlab-runner1");
    expect(JSON.stringify(template)).toMatch("gitlab-runner2");
    expect(JSON.stringify(template)).toMatch("gitlab-runner3");
  });

  it("Should generate a unique gitlab runner name when provided a configuration without the name set", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "MockStack", {
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    const token = new StringParameter(stack, "imported-token", {
      parameterName: "/gitlab-runner/token",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    // When
    new GitlabRunnerAutoscaling(stack, "Runner", {
      runners: [
        {
          token: token,
          configuration: {},
        },
      ],
    });

    // Then
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::AutoScaling::LaunchConfiguration", {});
  });
});
