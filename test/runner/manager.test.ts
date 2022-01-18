import { Template } from "@aws-cdk/assertions";
import { Bucket } from "@aws-cdk/aws-s3";
import { App, Stack } from "@aws-cdk/core";
import { GitlabRunnerAutoscalingJobRunner, GitlabRunnerAutoscalingManager, Network } from "../../lib";

const stackProps = {
  env: {
    account: "123456789012",
    region: "us-east-1",
  },
};

describe("Manager", () => {
  it("Create Manager", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "Stack", stackProps);
    new GitlabRunnerAutoscalingManager(stack, "cache", {
      runners: [
        new GitlabRunnerAutoscalingJobRunner(stack, "Runner1", {
          gitlabToken: "gitlabtoken1",
        }),
      ],
      runnersSecurityGroupName: "sg",
      network: new Network(stack, "Network"),
      cacheBucket: new Bucket(stack, "CacheBucket"),
    });

    // When
    const template = Template.fromStack(stack);

    // Then
    template.hasResourceProperties("AWS::S3::Bucket", {
      BucketName: "ck-name-and-a-very-very-long-bucket-name-123456789012-us-east-1",
    });
    expect(template).toMatchSnapshot();
  });
});
