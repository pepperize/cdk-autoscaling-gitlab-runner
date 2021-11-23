import { Vpc } from "@aws-cdk/aws-ec2";
import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { GitlabRunnerAutoscaling } from "./runner";

export type GitlabRunnerStackProps = StackProps;

export class GitlabRunnerStack extends Stack {
  constructor(scope: Construct, id: string, props: GitlabRunnerStackProps) {
    super(scope, id, props);
    const vpc = Vpc.fromLookup(this, "GitlabRunnerVpc", {
      vpcId: "vpc-0da907b688369469e",
    });
    new GitlabRunnerAutoscaling(this, id, {
      gitlabToken: "iieC-HsJsedAse2vq486",
      network: {
        vpc,
      },
    });
  }
}
