import { App } from "@aws-cdk/core";
import { GitlabRunnerStack } from "./gitlab-runner-stack";

const prodEnv = {
  account: "637898683827",
  region: "us-east-1",
};

const app = new App();

new GitlabRunnerStack(app, "GitlabRunnerStack", {
  gitlabToken: "iieC-HsJsedAse2vq486",
  vpcIdToLookUp: "vpc-0f413950c9d415553",
  env: prodEnv,
});

app.synth();
