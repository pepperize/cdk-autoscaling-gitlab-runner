const process = require("process");
import { App } from "@aws-cdk/core";
import {
  GitlabRunnerStack
} from "./cdk-gitlab-runner-stack";

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new GitlabRunnerStack(app, "GitlabRunnerStack", {
  gitlabUrl: "", // URL of your GitLab instance
  gitlabToken: "",
  gitlabMaxBuilds: "",
  gitlabMaxConcurrentBuilds: "",
  gitlabIdleCount: "",
  gitlabIdleTime: "",
  gitlabOffPeakTimezone: "",
  gitlabOffPeakIdleCount: "",
  gitlabOffPeakIdleTime: "",
  gitlabCheckInterval: "",
  gitlabRunnerSpotInstance: "",
  gitlabRunnerSpotInstancePrice: "",
  env: prodEnv,
});

app.synth();
