import "@aws-cdk/assert/jest";
import { App } from "@aws-cdk/core";
import { WithCustomCacheBucketStack } from "../src/cache";

test("WithCustomCacheBucketStack", () => {
  const app = new App();
  const stack = new WithCustomCacheBucketStack(app, "WithCustomCacheBucketStack", {
    gitlabToken: "your gitlab token",
    env: {
      account: "0",
      region: "us-east-1",
    },
  });

  expect(stack).toHaveResource("AWS::S3::Bucket");
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});
