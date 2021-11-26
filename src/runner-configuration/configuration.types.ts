export type ConfigurationArray =
  | boolean[]
  | number[]
  | string[]
  | ConfigurationMap[];
export type AnyConfiguration =
  | boolean
  | number
  | string
  | ConfigurationMap
  | ConfigurationArray
  | ConfigurationArray[];

export interface ConfigurationMap {
  [key: string]: AnyConfiguration;
}

/**
 * https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#configuring-the-runner
 * @internal
 */
export type GlobalConfiguration = {
  /**
   * The limit of the jobs that can be run concurrently across all runners (concurrent).
   * @default 10
   */
  readonly concurrent: number;

  /**
   * The check_interval option defines how often the runner should check GitLab for new jobs| in seconds.
   * @default 0
   */
  readonly check_interval: number;

  /**
   * The log format
   */
  readonly log_format: LogFormat;

  /**
   * The log_level
   */
  readonly log_level: LogLevel;

  /**
   * The GitLab Runners configuration.
   */
  readonly runners: RunnersConfiguration[];
  [key: string]: AnyConfiguration;
};

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal" | "panic";

export type LogFormat = "runner" | "text" | "json";

/**
 * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section
 * @internal
 */
export type RunnersConfiguration = {
  /**
   * The runner’s name.
   * @default "gitlab-runner"
   */
  readonly name: string;
  /**
   * GitLab instance URL.
   * @default "https://gitlab.com"
   */
  readonly url: string;
  /**
   * The GitLab Runner’s authentication token, which is obtained during runner registration.
   * https://docs.gitlab.com/ee/api/runners.html#registration-and-authentication-tokens
   */
  readonly token: string;
  /**
   * Limit how many jobs can be handled concurrently by this registered runner.
   * @default 10
   */
  readonly limit: number;
  /**
   * Maximum build log size in kilobytes.
   * @default 52428800 Default is 50 GB.
   */
  readonly output_limit: number;

  /**
   * The following executors are available.
   * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-executors
   * @default "docker+machine" Use auto-scaled Docker machines.
   */
  readonly executor: Executor;
  /**
   * Append or overwrite environment variables.
   * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section
   * @default ["DOCKER_DRIVER=overlay2","DOCKER_TLS_CERTDIR=/certs"]
   */
  readonly environment: string[];
  readonly docker: DockerConfiguration;
  readonly cache: CacheConfiguration;
  readonly machine: MachineConfiguration;
  [key: string]: AnyConfiguration;
};

/**
 * @internal
 */
export type Executor = "docker+machine" | "docker";

/**
 * This defines the Docker Container parameters.
 * @see https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section
 * @internal
 */
export type DockerConfiguration = {
  readonly tls_verify: boolean;
  /**
   * The image to run jobs with.
   * @default
   */
  readonly image: string;
  readonly privileged: boolean;
  readonly cap_add: string[];
  readonly wait_for_services_timeout: number;
  readonly disable_cache: boolean;
  readonly volumes: string[];
  readonly shm_size: number;
  [key: string]: AnyConfiguration;
};

/**
 * @internal
 */
export type CacheConfiguration = {
  readonly Type: "s3";
  readonly Shared: boolean;
  readonly s3: CacheS3Configuration;
  [key: string]: AnyConfiguration;
};

/**
 * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section}
 * @internal
 */
export type CacheS3Configuration = {
  /**
   * The AWS S3 host.
   * @default "s3.amazonaws.com"
   */
  readonly ServerAddress: string;
  /**
   * The name of the storage bucket where cache is stored.
   * @default "runners-cache"
   */
  readonly BucketName: string;
  /**
   * The name of the S3 region.
   */
  readonly BucketLocation: string;

  [key: string]: AnyConfiguration;
};

/**
 * The following parameters define the Docker Machine-based autoscaling feature.
 * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachine-section}
 * @see {@link https://docs.gitlab.com/runner/configuration/autoscale.html#how-concurrent-limit-and-idlecount-generate-the-upper-limit-of-running-machines}
 * @internal
 */
export type MachineConfiguration = {
  readonly IdleCount: number;
  readonly IdleTime: number;
  readonly MaxBuilds: number;
  readonly MachineDriver: "amazonec2" | string;
  readonly MachineName: string;
  readonly MachineOptions: string[];
  readonly autoscaling: AutoscalingConfiguration[];
  [key: string]: AnyConfiguration;
};

/**
 * @see {@link https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances}
 * @internal
 */
export type SpotConfiguration = {
  readonly requestSpotInstance: boolean;
  readonly spotPrice: number;
  readonly blockDurationMinutes: SpotBlockDurationInMinutes;
};

export type SpotBlockDurationInMinutes = 0 | 60 | 120 | 180 | 240 | 300 | 360;

/**
 * @internal
 */
export class MachineOptions {
  public static fromProps(props: ConfigurationMap): MachineOptions {
    return new MachineOptions(props);
  }

  constructor(private readonly props: ConfigurationMap) {}

  toArray(): string[] {
    const options = [];

    for (const key in this.props) {
      const value = this.props[key];
      if (value === undefined) {
        continue;
      }
      options.push(`amazonec2-${key}=${value}`);
    }

    return options;
  }
}
/**
 * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections}
 * @internal
 */
export type AutoscalingConfiguration = {
  readonly IdleCount: number;
  readonly IdleTime: number;
  /**
   * The Periods setting contains an array of string patterns of time periods represented in a cron-style format.
   * https://github.com/gorhill/cronexpr#implementation
   *
   * [second] [minute] [hour] [day of month] [month] [day of week] [year]
   *
   * @example
   * // "* * 7-22 * * mon-fri *"
   */
  readonly Periods: string[];
  readonly Timezone: Timezone;
  [key: string]: AnyConfiguration;
};

export type Timezone =
  | "Africa/Algiers"
  | "Africa/Cairo"
  | "Africa/Casablanca"
  | "Africa/Harare"
  | "Africa/Johannesburg"
  | "Africa/Monrovia"
  | "Africa/Nairobi"
  | "America/Argentina/Buenos_Aires"
  | "America/Bogota"
  | "America/Caracas"
  | "America/Chicago"
  | "America/Chihuahua"
  | "America/Denver"
  | "America/Godthab"
  | "America/Guatemala"
  | "America/Guyana"
  | "America/Halifax"
  | "America/Indiana/Indianapolis"
  | "America/Juneau"
  | "America/La_Paz"
  | "America/Lima"
  | "America/Los_Angeles"
  | "America/Mazatlan"
  | "America/Mexico_City"
  | "America/Monterrey"
  | "America/Montevideo"
  | "America/New_York"
  | "America/Phoenix"
  | "America/Regina"
  | "America/Santiago"
  | "America/Sao_Paulo"
  | "America/St_Johns"
  | "America/Tijuana"
  | "Asia/Almaty"
  | "Asia/Baghdad"
  | "Asia/Baku"
  | "Asia/Bangkok"
  | "Asia/Chongqing"
  | "Asia/Colombo"
  | "Asia/Dhaka"
  | "Asia/Hong_Kong"
  | "Asia/Irkutsk"
  | "Asia/Jakarta"
  | "Asia/Jerusalem"
  | "Asia/Kabul"
  | "Asia/Kamchatka"
  | "Asia/Karachi"
  | "Asia/Kathmandu"
  | "Asia/Kolkata"
  | "Asia/Krasnoyarsk"
  | "Asia/Kuala_Lumpur"
  | "Asia/Kuwait"
  | "Asia/Magadan"
  | "Asia/Muscat"
  | "Asia/Novosibirsk"
  | "Asia/Rangoon"
  | "Asia/Riyadh"
  | "Asia/Seoul"
  | "Asia/Shanghai"
  | "Asia/Singapore"
  | "Asia/Taipei"
  | "Asia/Tashkent"
  | "Asia/Tbilisi"
  | "Asia/Tehran"
  | "Asia/Tokyo"
  | "Asia/Ulaanbaatar"
  | "Asia/Urumqi"
  | "Asia/Vladivostok"
  | "Asia/Yakutsk"
  | "Asia/Yekaterinburg"
  | "Asia/Yerevan"
  | "Atlantic/Azores"
  | "Atlantic/Cape_Verde"
  | "Atlantic/South_Georgia"
  | "Australia/Adelaide"
  | "Australia/Brisbane"
  | "Australia/Darwin"
  | "Australia/Hobart"
  | "Australia/Melbourne"
  | "Australia/Perth"
  | "Australia/Sydney"
  | "Etc/UTC"
  | "Europe/Amsterdam"
  | "Europe/Athens"
  | "Europe/Belgrade"
  | "Europe/Berlin"
  | "Europe/Bratislava"
  | "Europe/Brussels"
  | "Europe/Bucharest"
  | "Europe/Budapest"
  | "Europe/Copenhagen"
  | "Europe/Dublin"
  | "Europe/Helsinki"
  | "Europe/Istanbul"
  | "Europe/Kiev"
  | "Europe/Lisbon"
  | "Europe/Ljubljana"
  | "Europe/London"
  | "Europe/Madrid"
  | "Europe/Minsk"
  | "Europe/Moscow"
  | "Europe/Paris"
  | "Europe/Prague"
  | "Europe/Riga"
  | "Europe/Rome"
  | "Europe/Sarajevo"
  | "Europe/Skopje"
  | "Europe/Sofia"
  | "Europe/Stockholm"
  | "Europe/Tallinn"
  | "Europe/Vienna"
  | "Europe/Vilnius"
  | "Europe/Warsaw"
  | "Europe/Zagreb"
  | "Pacific/Apia"
  | "Pacific/Auckland"
  | "Pacific/Chatham"
  | "Pacific/Fakaofo"
  | "Pacific/Fiji"
  | "Pacific/Guadalcanal"
  | "Pacific/Guam"
  | "Pacific/Honolulu"
  | "Pacific/Majuro"
  | "Pacific/Midway"
  | "Pacific/Noumea"
  | "Pacific/Pago_Pago"
  | "Pacific/Port_Moresby"
  | "Pacific/Tongatapu";
