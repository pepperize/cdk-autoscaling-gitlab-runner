import { Stack, Construct } from "@aws-cdk/core";
import { GitlabRunnerAutoscaling } from "@pepperize-testing/cdk-autoscaling-gitlab-runner";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithOnDemandInstancesStackProps extends RunnerStackProps {}

export class OnDemandInstancesStack extends Stack {
  constructor(scope: Construct, id: string, props: WithOnDemandInstancesStackProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      runners: {
        machine: {
          machineOptions: {
            requestSpotInstance: false,
          },
        },
      },
    });
  }
}
