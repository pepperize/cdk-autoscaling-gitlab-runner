import { Capture, Template } from "@aws-cdk/assertions";
import { App } from "@aws-cdk/core";
import { CacheBucketStack } from "../src/cache";

test("WithCustomCacheBucketStack", () => {
  const app = new App();
  const stack = new CacheBucketStack(app, "WithCustomCacheBucketStack", {
    gitlabToken: "your gitlab token",
    env: {
      account: "0",
      region: "us-east-1",
    },
  });

  const template = Template.fromStack(stack);
  const capture = new Capture();

  template.hasResourceProperties("AWS::S3::Bucket", capture);
  template.templateMatches(capture);
  expect(template).toMatchSnapshot();
});
