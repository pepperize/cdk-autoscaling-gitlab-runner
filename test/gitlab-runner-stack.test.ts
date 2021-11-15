import { SynthUtils } from "@aws-cdk/assert";
import {} from "@aws-cdk/aws-ec2";
import { App } from "@aws-cdk/core";
import {
  GitlabRunnerStack,
  GitlabRunnerStackProps,
} from "../src/gitlab-runner-stack";

test("gitlab-runner", () => {
  const app = new App();

  const props: GitlabRunnerStackProps = {
    env: {
      account: "0",
      region: "us-east-1",
    },
  };
  const gitlabRunnerStack = new GitlabRunnerStack(app, "gitlab-runner", props);

  expect(SynthUtils.toCloudFormation(gitlabRunnerStack)).toMatchSnapshot();
});
