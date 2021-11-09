import { App } from "@aws-cdk/core";
import { GitlabRunnerStack } from "./cdk-gitlab-runner-stack";

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new GitlabRunnerStack(app, "GitlabRunnerStack", {
  gitlabToken: "",
  vpcIdToLookUp: "vpc-0c8e4fbcc7f6b524a",
  env: prodEnv,
});

app.synth();
