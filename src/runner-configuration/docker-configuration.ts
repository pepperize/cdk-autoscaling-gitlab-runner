/**
 * Configure docker on the runners.
 *
 * @see https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section
 */
export interface DockerConfiguration {
  /**
   * Wildcard list of images that can be specified in the .gitlab-ci.yml file. If not present, all images are allowed (equivalent to ["*\/*:*"]). See Restrict Docker images and services.
   */
  readonly allowedImages?: string[];
  /**
   * Wildcard list of services that can be specified in the .gitlab-ci.yml file. If not present, all images are allowed (equivalent to [*\/*:*]). See Restrict Docker images and services.
   */
  readonly allowedServices?: string[];
  /**
   * Directory where Docker caches should be stored. This path can be absolute or relative to current working directory. See disable_cache for more information.
   */
  readonly cacheDir?: string;
  /**
   * Add additional Linux capabilities to the container.
   * @default ["CAP_SYS_ADMIN"]
   */
  readonly capAdd?: string[];

  /**
   * Drop additional Linux capabilities from the container.
   */
  readonly capDrop?: string[];

  /**
   * The control group’s CpusetCpus. A string.
   */
  readonly cpusetCpus?: string;

  /**
   * Number of CPU shares used to set relative CPU usage. Default is 1024.
   */
  readonly cpuShares?: number;

  /**
   * Number of CPUs (available in Docker 1.13 or later. A string.
   */
  readonly cpus?: string;

  /**
   * Share additional host devices with the container.
   */
  readonly devices?: string[];

  /**
   * The Docker executor has two levels of caching: a global one (like any other executor) and a local cache based on Docker volumes. This configuration flag acts only on the local one which disables the use of automatically created (not mapped to a host directory) cache volumes. In other words, it only prevents creating a container that holds temporary files of builds, it does not disable the cache if the runner is configured in distributed cache mode.
   * @default false
   */
  readonly disableCache?: boolean;

  /**
   * Disable the image entrypoint overwriting.
   */
  readonly disableEntrypointOverwrite?: boolean;

  /**
   * A list of DNS servers for the container to use.
   */
  readonly dns?: string[];

  /**
   * A list of DNS search domains.
   */
  readonly dnsSearch?: string[];

  /**
   * Hosts that should be defined in container environment.
   */
  readonly extraHosts?: string[];

  /**
   * GPU devices for Docker container. Uses the same format as the docker cli. View details in the Docker documentation.
   */
  readonly gpus?: string[];

  /**
   * (Advanced) The default helper image used to clone repositories and upload artifacts.
   */
  readonly helperImage?: string;

  /**
   * Sets the helper image flavor (alpine, alpine3.12, alpine3.13, alpine3.14 or ubuntu). Defaults to alpine. The alpine flavor uses the same version as alpine3.12.
   */
  readonly helperImageFlavor?: string;

  /**
   * Custom Docker endpoint. Default is DOCKER_HOST environment or unix:///var/run/docker.sock.
   */
  readonly host?: string;

  /**
   * Custom hostname for the Docker container.
   */
  readonly hostname?: string;

  /**
   * The image to run jobs with.
   */
  readonly image?: string;

  /**
   * Containers that should be linked with container that runs the job.
   */
  readonly links?: string[];

  /**
   * The memory limit. A string.
   */
  readonly memory?: string;

  /**
   * The total memory limit. A string.
   */
  readonly memorySwap?: string;

  /**
   * The memory soft limit. A string.
   */
  readonly memoryReservation?: string;

  /**
   * Add container to a custom network.
   */
  readonly networkMode?: string;

  /**
   * If an out-of-memory (OOM) error occurs, do not kill processes in a container.
   */
  readonly oomKillDisable?: boolean;

  /**
   * OOM score adjustment. Positive means kill earlier.
   */
  readonly oomScoreAdjust?: string;

  /**
   * Make the container run in privileged mode. Insecure.
   * @default true
   */
  readonly privileged?: boolean;

  /**
   * The image pull policy: never, if-not-present or always (default). View details in the pull policies documentation. You can also add multiple pull policies.
   */
  readonly pullPolicy?: string;

  /**
   * The runtime for the Docker container.
   */
  readonly runtime?: string;

  /**
   * Security options (–security-opt in docker run). Takes a list of : separated key/values.
   */
  readonly securityOpt?: string;

  /**
   * Shared memory size for images (in bytes).
   * @default 0
   */
  readonly shmSize?: number;

  /**
   * The sysctl options.
   */
  readonly sysctls?: string;

  /**
   * A directory where ca.pem, cert.pem or key.pem are stored and used to make a secure TLS connection to Docker. Useful in boot2docker.
   */
  readonly tlsCertPath?: string;

  /**
   * Enable or disable TLS verification of connections to Docker daemon. Disabled by default.
   * @default false
   */
  readonly tlsVerify?: boolean;

  /**
   * The user namespace mode for the container and Docker services when user namespace remapping option is enabled. Available in Docker 1.10 or later.
   */
  readonly usernsMode?: string;

  /**
   * Additional volumes that should be mounted. Same syntax as the Docker -v flag.
   */
  readonly volumes?: string[];

  /**
   * A list of volumes to inherit from another container in the form <container name>[:<ro|rw>]. Access level defaults to read-write, but can be manually set to ro (read-only) or rw (read-write).
   */
  readonly volumesFrom?: string[];

  /**
   * The volume driver to use for the container.
   */
  readonly volumeDriver?: string;

  /**
   * How long to wait for Docker services. Set to 0 to disable. Default is 30.
   * @default 300
   */
  readonly waitForServicesTimeout?: number;
}
