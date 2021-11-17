import { IMachineImage, InstanceType } from "@aws-cdk/aws-ec2";
import { CfnInstanceProfile } from "@aws-cdk/aws-iam";
import { IBucket } from "@aws-cdk/aws-s3";
import { Stack } from "@aws-cdk/core";
import { stringify } from "@iarna/toml";
import {
  defaultAutoscalingConfiguration,
  defaultCacheConfiguration,
  defaultConfiguration,
  defaultDockerConfiguration,
  defaultMachineConfiguration,
  defaultRunnersConfiguration,
} from "./configuration.default";
import { GlobalConfiguration, MachineOptions } from "./configuration.types";

export interface ConfigurationProps {
  scope: Stack;
  /**
   * The GitLab Runner's auth token.
   */
  gitlabToken: string;
  cache: IBucket;
  vpc: {
    vpcId: string;
    subnetId: string;
    availabilityZone: string;
  };
  runner: {
    instanceType: InstanceType;
    machineImage: IMachineImage;
    securityGroupName: string;
    instanceProfile: CfnInstanceProfile;
  };
  spot: {
    requestSpotInstance: boolean;
    blockDurationInMinutes?: number;
    spotPrice: number;
  };
}

export class Configuration {
  public static fromProps(props: ConfigurationProps) {
    const { scope, gitlabToken, cache, vpc, runner, spot } = props;

    const configuration = {
      ...defaultConfiguration,
      runners: [
        {
          ...defaultRunnersConfiguration,
          name: scope.stackName,
          token: gitlabToken,
          cache: {
            ...defaultCacheConfiguration,
            s3: {
              ServerAddress: `s3.${scope.urlSuffix}`,
              BucketName: `${cache.bucketName}`,
              BucketLocation: `${scope.region}`,
            },
          },
          docker: {
            ...defaultDockerConfiguration,
          },
          machine: {
            ...defaultMachineConfiguration,
            MachineOptions: MachineOptions.fromProps({
              "instance-type": runner.instanceType.toString(),
              ami: runner.machineImage.getImage(scope).imageId,
              region: scope.region,
              "vpc-id": vpc.vpcId,
              zone: vpc.availabilityZone,
              "subnet-id": vpc.subnetId,
              "security-group": `${runner.securityGroupName}`,
              "use-private-address": true,
              "iam-instance-profile": `${runner.instanceProfile.instanceProfileName}`,
              "request-spot-instance": spot.requestSpotInstance,
              "block-duration-minutes": spot.blockDurationInMinutes,
              "spot-price": spot.spotPrice,
            }).toArray(),
            autoscaling: [
              {
                ...defaultAutoscalingConfiguration,
              },
            ],
          },
        },
      ],
    };

    return new Configuration(configuration);
  }

  constructor(readonly configuration: GlobalConfiguration) {}

  toToml(): string {
    return stringify(this.configuration);
  }
}
