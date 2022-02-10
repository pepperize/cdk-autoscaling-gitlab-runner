import { Template } from "aws-cdk-lib/assertions";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { App, Stack } from "aws-cdk-lib/core";
import { GitlabRunnerAutoscalingJobRunner, GitlabRunnerAutoscalingManager, Network } from "../../src";

const stackProps = {
  env: {
    account: "123456789012",
    region: "us-east-1",
  },
};

describe("Manager", () => {
  it("Should create Manager launch configuration", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "Stack", stackProps);
    new GitlabRunnerAutoscalingManager(stack, "cache", {
      runners: [
        new GitlabRunnerAutoscalingJobRunner(stack, "Runner1", {
          configuration: {
            token: "gitlabtoken1",
            name: "runner1",
          },
        }),
      ],
      runnersSecurityGroupName: "sg",
      network: new Network(stack, "Network"),
      cacheBucket: new Bucket(stack, "CacheBucket"),
    });

    // When
    const template = Template.fromStack(stack);

    // Then
    expect(template).toMatchSnapshot();
  });
});
