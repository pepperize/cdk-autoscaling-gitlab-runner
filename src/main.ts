import { App } from "@aws-cdk/core";
import { GitlabRunnerStack } from "./gitlab-runner-stack";

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new GitlabRunnerStack(app, "GitlabRunnerStack", {
  gitlabToken: "GLSEx8hz",
  vpcIdToLookUp: "vpc-0f413950c9d415553",
  env: prodEnv,
});

app.synth();
