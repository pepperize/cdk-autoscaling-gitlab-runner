import { App } from "@aws-cdk/core";
import { GitlabRunnerStack } from "./gitlab-runner-stack";

const prodEnv = {
  account: "637898683827",
  region: "us-east-1",
};

const app = new App();

new GitlabRunnerStack(app, "GitlabRunnerStack", {
  env: prodEnv,
});

app.synth();
