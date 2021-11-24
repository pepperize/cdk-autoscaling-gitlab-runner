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
  defaultRunnerConfiguration,
} from "./configuration.default";
import { GlobalConfiguration, MachineOptions } from "./configuration.types";

export interface ConfigurationProps {
  scope: Stack;
  /**
   * The GitLab Runner's auth token.
   */
  gitlabToken: string;
  /**
   * GitLab instance URL.
   * @default "https://gitlab.com"
   */
  gitlabUrl: string;
  cache: IBucket;
  vpc: {
    vpcId: string;
    subnetId: string;
    /**
     *
     * The availability zone of the vpc contains the region prefixed. The GitLab Runner configuration accepts only the availability zone symbol i.e. a.
     */
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

/**
 * The GitLab Runner configuration to generate the {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html | config.toml}.
 */
export class Configuration {
  /**
   * Creates a configuration from the {@link GitlabRunnerAutoscaling} merged with default presets.
   */
  public static fromProps(props: ConfigurationProps) {
    const { scope, gitlabToken, gitlabUrl, cache, vpc, runner, spot } = props;

    const configuration = {
      ...defaultConfiguration,
      runners: [
        {
          ...defaultRunnerConfiguration,
          name: scope.stackName,
          token: gitlabToken,
          url: gitlabUrl,
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
              zone: vpc.availabilityZone.replace(scope.region, ""),
              "subnet-id": vpc.subnetId,
              "security-group": `${runner.securityGroupName}`,
              "use-private-address": true,
              "iam-instance-profile": `${runner.instanceProfile.ref}`,
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

  /**
   * Returns the configuration as toml formatted string.
   */
  toToml(): string {
    return stringify(this.configuration);
  }
}
