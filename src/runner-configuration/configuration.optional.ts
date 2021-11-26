import {
  AnyConfiguration,
  LogFormat,
  LogLevel,
  SpotBlockDurationInMinutes,
} from "./configuration.types";

/**
 * You can change the behavior of GitLab Runner and of individual registered runners.
 * This imitates the structure of Gitlab Runner advanced configuration that originally is set with config.toml file.
 * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html}
 */
export interface GitlabRunnerAdvancedConfigurationOptionalProps {
  /**
   * The limit of the jobs that can be run concurrently across all runners (concurrent).
   * @default 10
   */
  readonly concurrent?: number;

  /**
   * The check_interval parameter. Defines in seconds how often the runner should check GitLab for new jobs.
   * @default 0
   */
  readonly checkInterval?: number;

  /**
   * The log_format parameter. Specifies the log format. Options are runner, text, and json.
   * @default "runner"
   */
  readonly logFormat?: LogFormat;

  /**
   * The log_level parameter. Defines the log level. Options are debug, info, warn, error, fatal, and panic.
   * @default "info"
   */
  readonly logLevel?: LogLevel;

  /**
   * The GitLab Runners configuration.
   * @link RunnersConfigurationOptionalProps
   */
  readonly runners?: RunnersConfigurationOptionalProps;

  /**
   * Any extra configuration
   * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-global-section}
   */
  [key: string]: AnyConfiguration | any;
}

/**
 * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section}
 */
export interface RunnersConfigurationOptionalProps {
  /**
   * The runner’s name.
   * @default "gitlab-runner"
   */
  readonly name?: string;
  /**
   * GitLab instance URL.
   * @default "https://gitlab.com"
   */
  readonly url?: string;
  /**
   * Limit how many jobs can be handled concurrently by this registered runner.
   * @default 10
   */
  readonly limit?: number;
  /**
   * Maximum build log size in kilobytes.
   * @default 52428800 Default is 50 GB.
   */
  readonly outputLimit?: number;
  /**
   * Append or overwrite environment variables.
   * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section}
   * @default ["DOCKER_DRIVER=overlay2","DOCKER_TLS_CERTDIR=/certs"]
   */
  readonly environment?: string[];

  /**
   * @link MachineConfigurationOptionalProps
   */
  readonly machine?: MachineConfigurationOptionalProps;
  [key: string]: AnyConfiguration | any;
}

/**
 * The following parameters define the Docker Machine-based autoscaling feature.
 * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachine-section}
 */
export interface MachineConfigurationOptionalProps {
  /**
   * The IdleCount parameter. Number of machines that need to be created and waiting in Idle state.
   * @default 0
   */
  readonly idleCount?: number;
  /**
   * The IdleTime parameter. Time (in seconds) for machine to be in Idle state before it is removed.
   * @default 300
   */
  readonly idleTime?: number;
  /**
   * The MaxBuilds parameter. Maximum job (build) count before machine is removed.
   * @default 20
   */
  readonly maxBuilds?: number;
  /**
   * MachineName parameter. Here it *MUST NOT* contain `%s`.
   * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachine-section}
   * @default "gitlab-runner"
   */
  readonly machineName?: string;

  /**
   * @link MachineOptionsOptionalProps
   */
  readonly machineOptions?: MachineOptionsOptionalProps;
}

export interface MachineOptionsOptionalProps {
  /**
   * The amazonec2-request-spot-instance parameter. Whether or not to request spot instances.
   * @see {@link https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances}
   * @see {@link https://aws.amazon.com/ec2/spot/}
   * @default true
   */
  readonly requestSpotInstance: boolean;
  /**
   * The amazonec2-spot-price parameter. The bidding price for spot instances.
   * @see {@link https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances}
   * @see {@link https://aws.amazon.com/ec2/spot/pricing/}
   * @default 0.03
   */
  readonly spotPrice: number;
  /**
   * The amazonec2-block-duration-minutes parameter. AWS spot instance duration in minutes (60, 120, 180, 240, 300, or 360).
   * @see {@link https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances}
   * @default 0
   */
  readonly blockDurationMinutes: SpotBlockDurationInMinutes;
}
