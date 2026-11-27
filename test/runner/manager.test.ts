import { SecurityGroup } from "@pepperize/cdk-security-group";
import { Template } from "aws-cdk-lib/assertions";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { ParameterTier, ParameterType, StringParameter } from "aws-cdk-lib/aws-ssm";
import { App, Stack } from "aws-cdk-lib/core";
import { GitlabRunnerAutoscalingJobRunner, GitlabRunnerAutoscalingManager, Network } from "../../src";

const stackProps = {
  env: {
    account: "123456789012",
    region: "us-east-1",
  },
};

describe("Manager", () => {
  it("Should match snapshot when Manager launch configuration is being set", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "Stack", stackProps);
    const vpc = Vpc.fromVpcAttributes(stack, "MyVpc", {
      vpcId: "vpc123",
      publicSubnetIds: ["pub1"],
      availabilityZones: ["us-east-1a"],
    });
    const securityGroup = new SecurityGroup(stack, "SG", {
      vpc: vpc,
    });
    const token = new StringParameter(stack, "imported-token", {
      parameterName: "/gitlab-runner/token",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    // When
    new GitlabRunnerAutoscalingManager(stack, "cache", {
      runners: [
        new GitlabRunnerAutoscalingJobRunner(stack, "Runner1", {
          token: token,
          configuration: {
            name: "runner1",
          },
        }),
      ],
      runnersSecurityGroup: securityGroup,
      network: new Network(stack, "Network"),
      cacheBucket: new Bucket(stack, "CacheBucket"),
    });
    const template = Template.fromStack(stack);

    // Then
    expect(template).toMatchSnapshot();
  });

  it("Should use the stack's partition in the vpc arn condition", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "Stack", { env: { account: "123456789012", region: "us-gov-west-1" } });
    const vpc = Vpc.fromVpcAttributes(stack, "MyVpc", {
      vpcId: "vpc123",
      publicSubnetIds: ["pub1"],
      availabilityZones: ["us-gov-west-1a"],
    });

    // When
    new GitlabRunnerAutoscalingManager(stack, "manager", {
      runners: [
        new GitlabRunnerAutoscalingJobRunner(stack, "Runner1", {
          token: StringParameter.fromStringParameterName(stack, "Token", "/gitlab-runner/token"),
          configuration: { name: "runner1" },
        }),
      ],
      runnersSecurityGroup: new SecurityGroup(stack, "SG", { vpc: vpc }),
      network: new Network(stack, "Network"),
      cacheBucket: new Bucket(stack, "CacheBucket"),
    });
    const template = Template.fromStack(stack);

    // Then
    const json = JSON.stringify(template.toJSON());
    expect(json).toContain("ec2:Vpc");
    expect(json).not.toContain("arn:aws:ec2");
  });
});
