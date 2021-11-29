import "@aws-cdk/assert/jest";
import { App } from "@aws-cdk/core";
import { ZeroConfigStack } from "../src/zero-config";

test("ZeroConfigStack", () => {
  const app = new App();
  const stack = new ZeroConfigStack(app, "ZeroConfigStack", {
    gitlabToken: "your gitlab token",
    env: {
      account: "0",
      region: "us-east-1",
    },
  });

  expect(stack).toHaveResource("AWS::S3::Bucket");
  expect(stack).toHaveResource("AWS::EC2::VPC");
  expect(stack).toHaveResource("AWS::AutoScaling::AutoScalingGroup");
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});
