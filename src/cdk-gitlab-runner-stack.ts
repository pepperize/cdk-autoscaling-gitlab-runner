import { IMachineImage, Instance, InstanceType, Vpc } from "@aws-cdk/aws-ec2";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

export interface GitlabRunnerStackProps extends StackProps {
  instanceTypeIdentifier: string;
  vpc: Vpc;
  machineImage: IMachineImage;
  /** These props come from "Parameters:" from runner.yml CFN template */
  cacheBucketName: string;
  cacheExpirationInDays: any; // todo: Provide some type
  vpcId: any; // todo: Provide some type
  availabilityZone: any; // todo: Provide some type
  subnetId: any; // todo: Provide some type
  managerImageId: any; // todo: Provide some type
  managerInstanceType: any; // todo: Provide some type
  managerKeyPair: any; // todo: Provide some type
  gitlabUrl: any; // todo: Provide some type
  gitlabToken: any; // todo: Provide some type
  gitlabRunnerInstanceType: any; // todo: Provide some type
  gitlabDockerImage: any; // todo: Provide some type
  gitlabMaxBuilds: any; // todo: Provide some type
  gitlabMaxConcurrentBuilds: any; // todo: Provide some type
  gitlabIdleCount: any; // todo: Provide some type
  gitlabIdleTime: any; // todo: Provide some type
  gitlabOffPeakTimezone: any; // todo: Provide some type
  gitlabOffPeakIdleCount: any; // todo: Provide some type
  gitlabOffPeakIdleTime: any; // todo: Provide some type
  gitlabCheckInterval: any; // todo: Provide some type
  gitlabRunnerSpotInstance: any; // todo: Provide some type
  gitlabRunnerSpotInstancePrice: any; // todo: Provide some type
}

export class GitlabRunnerStack extends Stack {
  constructor(scope: Construct, id: string, props: GitlabRunnerStackProps) {
    super(scope, id, props);

    new Instance(this, "GitlabRunnerInstance", {
      instanceType: new InstanceType(props.instanceTypeIdentifier),
      vpc: props.vpc,
      machineImage: props.machineImage,
    });
  }
}
