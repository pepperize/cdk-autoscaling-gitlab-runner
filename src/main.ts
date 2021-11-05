import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  SubnetType,
} from "@aws-cdk/aws-ec2";
import { App } from "@aws-cdk/core";
import { GitlabRunnerStack } from "./cdk-gitlab-runner-stack";

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

const app = new App();

const managerAmiMap: Record<string, string> = { // Record<REGION, AMI_ID>
    "eu-north-1": "ami-d16fe6af",
    "ap-south-1": "ami-0889b8a448de4fc44",
    "eu-west-3": "ami-0451ae4fd8dd178f7",
    "eu-west-2": "ami-09ead922c1dad67e4",
    "eu-west-1": "ami-07683a44e80cd32c5",
    "ap-northeast-2": "ami-047f7b46bd6dd5d84",
    "ap-northeast-1": "ami-0f9ae750e8274075b",
    "sa-east-1": "ami-0669a96e355eac82f",
    "ca-central-1": "ami-03338e1f67dae0168",
    "ap-southeast-1": "ami-0b419c3a4b01d1859",
    "ap-southeast-2": "ami-04481c741a0311bbb",
    "eu-central-1": "ami-09def150731bdbcc2",
    "us-east-1": "ami-0de53d8956e8dcf80",
    "us-east-2": "ami-02bcbb802e03574ba",
    "us-west-1": "ami-0019ef04ac50be30f",
    "us-west-2": "ami-061392db613a6357b"
};

new GitlabRunnerStack(app, "GitlabRunnerStack", {
  machineImage: MachineImage.genericLinux(managerAmiMap),
  cacheBucketName: "",
  cacheExpirationInDays: 0,
  availabilityZone: "",
  vpcSubnet: {subnetType: SubnetType.PRIVATE_ISOLATED},
  managerImageId: "",
  managerInstanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
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
  env: prodEnv,
});

app.synth();