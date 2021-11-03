import { SubnetType, Vpc } from "@aws-cdk/aws-ec2";
import { App } from "@aws-cdk/core";
import { GitlabRunnerStack } from "./cdk-gitlab-runner-stack";

const app = new App();

new GitlabRunnerStack(app, `GitlabRunnerStack`, {
  instanceTypeIdentifier: "",
  vpc: new Vpc(null, null, null),
  machineImage: null,
  cacheBucketName: "",
  cacheExpirationInDays: 0,
  availabilityZone: "",
  vpcSubnet: null,
  managerImageId: "",
  managerInstanceType: "",
  managerKeyPair: "",
  gitlabUrl: "",
  gitlabToken: "",
  gitlabRunnerInstanceType: "",
  gitlabDockerImage: "",
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

}),