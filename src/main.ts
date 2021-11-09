const process = require("process");
import { App } from "@aws-cdk/core";
import { GitlabRunnerStack } from "./cdk-gitlab-runner-stack";

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new GitlabRunnerStack(app, "GitlabRunnerStack", {
  vpcIdToLookUp: "",
  gitlabUrl: "", // URL of your GitLab instance
  gitlabToken: "",
  gitlabOffPeakTimezone: "",
  gitlabOffPeakIdleCount: "",
  gitlabOffPeakIdleTime: "",
  gitlabRunnerSpotInstancePrice: "",
  env: prodEnv,
});

app.synth();
