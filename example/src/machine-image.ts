import { MachineImage } from "@aws-cdk/aws-ec2";
import { Construct, Stack } from "@aws-cdk/core";
import { GitlabRunnerAutoscaling } from "@pepperize-testing/cdk-autoscaling-gitlab-runner";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomMachineImageProps extends RunnerStackProps {}

export class WithCustomMachineImageStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomMachineImageProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const amiMap: Record<string, string> = {
      region: "ami-id",
    };

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      runners: {
        machineImage: MachineImage.genericLinux(amiMap),
      },
    });
  }
}
