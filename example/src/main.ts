import { App } from "@aws-cdk/core";
import { CacheBucketStack } from "./cache";
import { DockerMachineConfigurationStack } from "./docker-machine";
import { InstanceTypeStack } from "./instance-type";
import { MachineImageStack } from "./machine-image";
import { OnDemandInstancesStack } from "./on-demand-instances";
import { RunnersRoleStack } from "./runner-role";
import { RunnerStackProps } from "./runner-stack-props";
import { VpcStack } from "./vpc";
import { ZeroConfigStack } from "./zero-config";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const gitlabToken = process.env.GITLAB_TOKEN!;

const app = new App();

const props: RunnerStackProps = { gitlabToken: gitlabToken, env: devEnv };

new CacheBucketStack(app, "CustomCacheBucketStack", props);
new DockerMachineConfigurationStack(app, "CustomDockerMachineConfigStack", props);
new InstanceTypeStack(app, "CustomInstanceTypeStack", props);
new MachineImageStack(app, "CustomInstanceTypeStack", props);
new OnDemandInstancesStack(app, "CustomInstanceTypeStack", props);
new RunnersRoleStack(app, "CustomInstanceTypeStack", props);
new VpcStack(app, "CustomInstanceTypeStack", props);
new ZeroConfigStack(app, "CustomInstanceTypeStack", props);

app.synth();
