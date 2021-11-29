import { InstanceClass, InstanceSize, InstanceType } from "@aws-cdk/aws-ec2";
import { Construct, Stack } from "@aws-cdk/core";
import { GitlabRunnerAutoscaling } from "@pepperize-testing/cdk-autoscaling-gitlab-runner";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomInstanceTypeProps extends RunnerStackProps {}

export class WithCustomInstanceTypeStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomInstanceTypeProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      runners: {
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
      },
    });
  }
}
