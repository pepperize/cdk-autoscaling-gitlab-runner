import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { Runner } from "./runner/runner";

/**
 * Documentation:
 * About concurrent, limit and IdleCount: https://docs.gitlab.com/runner/configuration/autoscale.html#how-concurrent-limit-and-idlecount-generate-the-upper-limit-of-running-machines
 * About autoscaling props: https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections
 */
type GitlabRunnerStackProps = StackProps;

export class GitlabRunnerStack extends Stack {
  constructor(scope: Construct, id: string, props: GitlabRunnerStackProps) {
    super(scope, id, props);
    new Runner(this, id, {
      gitlabToken: "iieC-HsJsedAse2vq486",
      vpcIdToLookUp: "vpc-0da907b688369469e",
    });
  }
}
