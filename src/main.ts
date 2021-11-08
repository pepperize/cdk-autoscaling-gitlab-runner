const process = require("process");
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  SubnetType,
} from "@aws-cdk/aws-ec2";
import { App } from "@aws-cdk/core";
import {
  GitlabRunnerStack,
  managerAmiMap as MANAGER_AMI_MAP,
} from "./cdk-gitlab-runner-stack";

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new GitlabRunnerStack(app, "GitlabRunnerStack", {
  machineImage: MachineImage.genericLinux(MANAGER_AMI_MAP),
  cacheBucketName: "RunnerCache",
  cacheExpirationInDays: 30,
  availabilityZone: "a",
  vpcSubnet: { subnetType: SubnetType.PUBLIC }, // TODO: Should be private with NAT?
  managerInstanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
  managerKeyPairName: "RunnerSSHKeyPair",
  gitlabUrl: "", // URL of your GitLab instance
  gitlabToken: "",
  gitlabRunnerInstanceType: InstanceType.of(
    InstanceClass.T2,
    InstanceSize.MICRO
  ),
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
  env: prodEnv,
});

app.synth();
