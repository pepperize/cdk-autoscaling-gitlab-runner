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
  Executor,
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
  /**
   * The GitLab Runner's auth token.
   */
  readonly gitlabToken: string;
  /**
   * The runners’s name.
   * @default "gitlab-runners"
   */
  readonly name?: string;
  /**
   * GitLab instance URL.
   * @default "https://gitlab.com"
   */
  readonly gitlabUrl?: string;
  /**
   * Limit how many jobs can be handled concurrently by this registered runners.
   * @default 10
   */
  readonly limit?: number;
  /**
   * Maximum build log size in kilobytes.
   * @default 52428800 Default is 50 GB.
   */
  readonly outputLimit?: number;
  /**
   * The following executors are available.
   * @see {@link https://docs.gitlab.com/runners/configuration/advanced-configuration.html#the-executors}
   * @default "docker+machine" Use auto-scaled Docker machines.
   */
  readonly executor?: Executor;
  /**
   * Append or overwrite environment variables.
   * @see {@link https://docs.gitlab.com/runners/configuration/advanced-configuration.html#the-runnerss-section}
   * @default ["DOCKER_DRIVER=overlay2","DOCKER_TLS_CERTDIR=/certs"]
   */
  readonly environment?: string[];

  readonly cache: IBucket;

  readonly machine: MachineConfigurationProps;
}

export interface MachineConfigurationProps {
  readonly machineOptions: MachineOptionsConfigurationProps;
}

export interface MachineOptionsConfigurationProps {
  readonly instanceType: InstanceType;
  readonly machineImage: IMachineImage;
  readonly securityGroupName: string;
  readonly instanceProfile: CfnInstanceProfile;
  readonly vpc: VpcConfigurationProps;
  readonly spot: SpotConfigurationProps;
}

export interface SpotConfigurationProps {
  readonly requestSpotInstance: boolean;
  readonly spotPrice: number;
}

export interface ConfigurationProps {
  readonly scope: Stack;
  readonly runners: RunnerConfigurationProps;
  readonly concurrent?: number;
  readonly checkInterval?: number;
  readonly logFormat?: "runner" | "text" | "json";
  readonly logLevel?: "debug" | "info" | "warn" | "error" | "fatal" | "panic";
}

/**
 * The GitLab Runner configuration to generate the [config.toml]{@link https://docs.gitlab.com/runners/configuration/advanced-configuration.html}.
 */
export class Configuration {
  /**
   * Creates a configuration from the {@link GitlabRunnerAutoscaling} merged with default presets.
   */
  public static fromProps(props: ConfigurationProps) {
    const { scope, runners, concurrent, checkInterval, logFormat, logLevel } =
      props;

    const configuration: GlobalConfiguration = {
      concurrent: concurrent || defaultConfiguration.concurrent,
      check_interval: checkInterval || defaultConfiguration.check_interval,
      log_format: logFormat || defaultConfiguration.log_format,
      log_level: logLevel || defaultConfiguration.log_level,
      runners: [
        {
          token: runners.gitlabToken,
          name:
            runners.name || scope.stackName || defaultRunnerConfiguration.name,
          url: runners.gitlabUrl || defaultRunnerConfiguration.url,
          limit: runners.limit ?? defaultRunnerConfiguration.limit,
          output_limit:
            runners.outputLimit ?? defaultRunnerConfiguration.output_limit,
          executor: runners.executor ?? defaultRunnerConfiguration.executor,
          environment:
            runners.environment ?? defaultRunnerConfiguration.environment,
          cache: {
            ...defaultCacheConfiguration,
            s3: {
              ServerAddress: `s3.${scope.urlSuffix}`,
              BucketName: `${runners.cache.bucketName}`,
              BucketLocation: `${scope.region}`,
            },
          },
          docker: {
            ...defaultDockerConfiguration,
          },
          machine: {
            ...defaultMachineConfiguration,
            MachineOptions: MachineOptions.fromProps({
              "instance-type":
                runners.machine.machineOptions.instanceType.toString(),
              ami: runners.machine.machineOptions.machineImage.getImage(scope)
                .imageId,
              region: scope.region,
              "vpc-id": runners.machine.machineOptions.vpc.vpcId,
              /**
               * extract the availabilityZone last character for the needs of gitlab configuration @see {@link https://docs.gitlab.com/runners/configuration/runners_autoscale_aws/#the-runnerssmachine-section}
               */
              zone: runners.machine.machineOptions.vpc.availabilityZone.slice(
                -1
              ),
              "subnet-id": runners.machine.machineOptions.vpc.subnetId,
              "security-group": `${runners.machine.machineOptions.securityGroupName}`,
              "use-private-address": true,
              "iam-instance-profile": `${runners.machine.machineOptions.instanceProfile.ref}`,
              "request-spot-instance":
                runners.machine.machineOptions.spot.requestSpotInstance,
              "spot-price": runners.machine.machineOptions.spot.spotPrice,
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
