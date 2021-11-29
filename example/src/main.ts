import { App } from "@aws-cdk/core";
import { WithCustomCacheBucketStack } from "./cache";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const gitlabToken = process.env.GITLAB_TOKEN!;

const app = new App();

new WithCustomCacheBucketStack(app, "WithCustomCache", { gitlabToken: gitlabToken, env: devEnv });

app.synth();
