import { Vpc } from "@aws-cdk/aws-ec2";
import { Stack, Construct } from "@aws-cdk/core";
import { GitlabRunnerAutoscaling } from "@pepperize-testing/cdk-autoscaling-gitlab-runner";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomVpcStackProps extends RunnerStackProps {}

export class WithCustomVpcStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomVpcStackProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const vpc = new Vpc(this, "Vpc", {
      // Your custom vpc
    });

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      network: { vpc: vpc },
    });
  }
}
