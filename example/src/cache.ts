import { Stack, Construct } from "@aws-cdk/core";
import { Bucket } from "@aws-cdk/aws-s3";
import { GitlabRunnerAutoscaling } from "@pepperize-testing/cdk-autoscaling-gitlab-runner";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomCacheBucketStackProps extends RunnerStackProps {}

export class CacheBucketStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomCacheBucketStackProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const cache = new Bucket(this, "Cache", {
      // Your custom bucket
    });

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      cache: { bucket: cache },
    });
  }
}
