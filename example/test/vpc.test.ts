import "@aws-cdk/assert/jest";
import { App } from "@aws-cdk/core";
import { WithCustomVpcStack } from "../src/vpc";

test("WithCustomVpcStack", () => {
  const app = new App();
  const stack = new WithCustomVpcStack(app, "WithCustomVpcStack", {
    gitlabToken: "your gitlab token",
    env: {
      account: "0",
      region: "us-east-1",
    },
  });

  expect(stack).toHaveResource("AWS::EC2::VPC");
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});
