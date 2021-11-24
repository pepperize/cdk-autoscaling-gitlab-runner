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
import {
  ConfigurationMap,
  GlobalConfiguration,
  MachineOptions,
} from "./configuration.types";

export interface VpcConfigurationProps {
  readonly vpcId: string;
  readonly subnetId: string;
  /**
   * The availability zone of the vpc contains the region prefixed. The GitLab Runner configuration accepts only the availability zone symbol i.e. a.
   */
  readonly availabilityZone: string;
}

export interface RunnerConfigurationProps {
  readonly instanceType: InstanceType;
  readonly machineImage: IMachineImage;
  readonly securityGroupName: string;
  readonly instanceProfile: CfnInstanceProfile;
}

export interface SpotConfigurationProps {
  readonly requestSpotInstance: boolean;
  readonly spotPrice: number;
}

export interface ConfigurationProps {
  readonly scope: Stack;
  /**
   * The GitLab Runner's auth token.
   */
  readonly gitlabToken: string;
  readonly cache: IBucket;
  readonly vpc: VpcConfigurationProps;
  readonly runner: RunnerConfigurationProps;
  readonly spot: SpotConfigurationProps;
}

/**
 * The GitLab Runner configuration to generate the {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html | config.toml}.
 */
export class Configuration {
  /**
   * Creates a configuration from the {@link GitlabRunnerAutoscaling} merged with default presets.
   */
  public static fromProps(props: ConfigurationProps) {
    const { scope, gitlabToken, cache, vpc, runner, spot } = props;

    const configuration: GlobalConfiguration = {
      ...defaultConfiguration,
      runners: [
        {
          ...defaultRunnerConfiguration,
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
              /**
               * extract the availabilityZone last character for the needs of gitlab configuration @see {@link https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section}
               */
              zone: vpc.availabilityZone.slice(-1),
              "subnet-id": vpc.subnetId,
              "security-group": `${runner.securityGroupName}`,
              "use-private-address": true,
              "iam-instance-profile": `${runner.instanceProfile.ref}`,
              "request-spot-instance": spot.requestSpotInstance,
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

  constructor(readonly globalConfiguration: ConfigurationMap) {}

  /**
   * Returns the configuration as toml formatted string.
   */
  toToml(): string {
    return stringify(this.globalConfiguration);
  }
}
