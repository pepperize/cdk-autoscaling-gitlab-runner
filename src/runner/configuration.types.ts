type Configuration =
  | (Pick<GlobalConfiguration, "runnersConfig"> & Partial<GlobalConfiguration>)
  | {
      runnersConfig:
        | Partial<RunnersConfiguration> & Pick<RunnersConfiguration, "token">;
    };

/**
 * https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#configuring-the-runner
 */
type GlobalConfiguration = {
  /**
   * The limit of the jobs that can be run concurrently across all runners (concurrent).
   * @default 10
   */
  concurrent: number;

  /**
   * The check_interval option defines how often the runner should check GitLab for new jobs| in seconds.
   * @default 0
   */
  checkInterval: number;

  /**
   * The GitLab Runners configuration.
   */
  runnersConfig: RunnersConfiguration;
};

/**
 * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section
 */
type RunnersConfiguration = {
  /**
   * The runner’s name.
   * @default "gitlab-runner"
   */
  name: string;
  /**
   * GitLab instance URL.
   * @default "https://gitlab.com"
   */
  url: string;
  /**
   * The runner’s authentication token, which is obtained during runner registration.
   * https://docs.gitlab.com/ee/api/runners.html#registration-and-authentication-tokens
   */
  token: string;
  /**
   * Limit how many jobs can be handled concurrently by this registered runner.
   * @default 10
   */
  limit: number;
  /**
   * Maximum build log size in kilobytes.
   * @default 52428800 Default is 50 GB.
   */
  outputLimit: number;
  docker: DockerConfiguration;
  cache: S3CacheConfiguration;
  machine: MachineConfiguration;
};

/**
 * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section
 */
type DockerConfiguration = {
  /**
   * The image to run jobs with.
   * @default
   */
  image: string;
};

/**
 * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section
 */
type S3CacheConfiguration = {
  /**
   * The AWS S3 host.
   * @default "s3.amazonaws.com"
   */
  serverAdress: string;
  /**
   * The name of the storage bucket where cache is stored.
   * @default "runners-cache"
   */
  bucketName: string;
  /**
   * The name of the S3 region.
   */
  bucketLocation: string;
};

/**
 * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachine-section
 */
type MachineConfiguration = {
  idleCount: number;
  idleTime: number;
  maxBuilds: number;
  machineName: string;
  machineOptions: MachineOptions;
  autoscaling: AutoscalingConfiguration[];
};
type MachineOptions = {
  instanceType: string;
  amiId: string;
  region: string;
  vpcId: string;
  availabilityZone: string;
  securityGroup: string;
  usePrivateAddress: boolean;
  instanceProfile: string;
  requestSpotInstances: boolean;
  sportPrice: number;
};
/**
 * https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections
 */
type AutoscalingConfiguration = {
  idleCount: number;
  idleTime: number;
  periods: Period[];
  timezone: Timezone;
};

/**
 * The Periods setting contains an array of string patterns of time periods represented in a cron-style format.
 * https://github.com/gorhill/cronexpr#implementation
 */
type Period = {
  second: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  year: string;
};

type Timezone =
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
  | "Pacific/Tongatapu"
  | "UTC";
