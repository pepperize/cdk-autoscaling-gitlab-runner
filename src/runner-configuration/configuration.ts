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
  AnyConfiguration,
  ConfigurationMap,
  Executor,
  GlobalConfiguration,
  LogFormat,
  LogLevel,
  MachineOptions,
  Timezone,
} from "./configuration.types";

export interface VpcConfigurationProps {
  readonly vpcId: string;
  readonly subnetId: string;
  /**
   * The availability zone of the vpc contains the region prefixed. The GitLab Runner configuration accepts only the availability zone symbol i.e. a.
   */
  readonly availabilityZone: string;
  [key: string]: AnyConfiguration | undefined | any;
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

  readonly docker?: DockerConfigurationProps;

  readonly machine: MachineConfigurationProps;

  [key: string]: AnyConfiguration | undefined | any;
}

export interface DockerConfigurationProps {
  readonly tlsVerify: boolean;
  /**
   * The image to run jobs with.
   * @default
   */
  readonly image?: string;
  readonly privileged?: boolean;
  readonly capAdd?: string[];
  readonly waitForServicesTimeout?: number;
  readonly disableCache?: boolean;
  readonly volumes?: string[];
  readonly shmSize?: number;
  [key: string]: AnyConfiguration | undefined | any;
}

export interface MachineConfigurationProps {
  readonly idleCount?: number;
  readonly idleTime?: number;
  readonly maxBuilds?: number;
  readonly machineDriver?: "amazonec2" | string;
  readonly machineName?: string;
  readonly machineOptions: MachineOptionsConfigurationProps;
  readonly autoscaling?: AutoscalingConfigurationProps;
  [key: string]: AnyConfiguration | undefined | any;
}

export interface AutoscalingConfigurationProps {
  readonly idleCount?: number;
  readonly idleTime?: number;
  /**
   * The Periods setting contains an array of string patterns of time periods represented in a cron-style format.
   * @see {@link https://github.com/gorhill/cronexpr#implementation}
   *
   * [second] [minute] [hour] [day of month] [month] [day of week] [year]
   *
   * @example
   * ```ts
   * ["* * 7-22 * * mon-fri *"]
   * ```
   */
  readonly periods?: string[];
  readonly timezone?: Timezone;
  [key: string]: AnyConfiguration | undefined | any;
}

export interface MachineOptionsConfigurationProps {
  readonly instanceType: InstanceType;
  readonly machineImage: IMachineImage;
  readonly securityGroupName: string;
  readonly instanceProfile: CfnInstanceProfile;
  readonly vpc: VpcConfigurationProps;
  readonly spot: SpotConfigurationProps;
  [key: string]: AnyConfiguration | undefined | any;
}

export interface SpotConfigurationProps {
  readonly requestSpotInstance: boolean;
  readonly spotPrice: number;
  [key: string]: AnyConfiguration | undefined | any;
}

export interface ConfigurationProps {
  readonly scope: Stack;
  readonly runners: RunnerConfigurationProps;
  /**
   * The limit of the jobs that can be run concurrently across all runners (concurrent).
   * @default 10
   */
  readonly concurrent?: number;
  /**
   * The check_interval option defines how often the runner should check GitLab for new jobs| in seconds.
   * @default 0
   */
  readonly checkInterval?: number;
  /**
   * The log format
   */
  readonly logFormat?: LogFormat;
  /**
   * The log_level
   */
  readonly logLevel?: LogLevel;
  [key: string]: AnyConfiguration | undefined | any;
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
      concurrent: concurrent ?? defaultConfiguration.concurrent,
      check_interval: checkInterval ?? defaultConfiguration.check_interval,
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
            Type: defaultCacheConfiguration.Type,
            Shared: defaultCacheConfiguration.Shared,
            s3: {
              ServerAddress: `s3.${scope.urlSuffix}`,
              BucketName: `${runners.cache.bucketName}`,
              BucketLocation: `${scope.region}`,
            },
          },
          docker: {
            tls_verify:
              runners.docker?.tlsVerify ||
              defaultDockerConfiguration.tls_verify,
            image: runners.docker?.image || defaultDockerConfiguration.image,
            privileged:
              runners.docker?.privileged ||
              defaultDockerConfiguration.privileged,
            cap_add:
              runners.docker?.capAdd || defaultDockerConfiguration.cap_add,
            wait_for_services_timeout:
              runners.docker?.waitForServicesTimeout ??
              defaultDockerConfiguration.wait_for_services_timeout,
            disable_cache:
              runners.docker?.disableCache ||
              defaultDockerConfiguration.disable_cache,
            volumes:
              runners.docker?.volumes || defaultDockerConfiguration.volumes,
            shm_size:
              runners.docker?.shmSize ?? defaultDockerConfiguration.shm_size,
          },
          machine: {
            IdleCount:
              runners.machine.idleCount ??
              defaultMachineConfiguration.IdleCount,
            IdleTime:
              runners.machine.idleTime ?? defaultMachineConfiguration.IdleTime,
            MaxBuilds:
              runners.machine.maxBuilds ??
              defaultMachineConfiguration.MaxBuilds,
            MachineDriver:
              runners.machine.machineDriver ||
              defaultMachineConfiguration.MachineDriver,
            MachineName:
              runners.machine.machineName ||
              defaultMachineConfiguration.MachineName,
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
                Periods:
                  runners.machine.autoscaling?.periods ||
                  defaultAutoscalingConfiguration.Periods,
                IdleCount:
                  runners.machine.autoscaling?.idleCount ??
                  defaultAutoscalingConfiguration.IdleCount,
                IdleTime:
                  runners.machine.autoscaling?.idleTime ??
                  defaultAutoscalingConfiguration.IdleTime,
                Timezone:
                  runners.machine.autoscaling?.timezone ||
                  defaultAutoscalingConfiguration.Timezone,
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
