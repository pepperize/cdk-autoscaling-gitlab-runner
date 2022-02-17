import { CacheConfiguration } from "./cache-configuration";
import { DockerConfiguration } from "./docker-configuration";
import { MachineConfiguration } from "./machine-configuration";

export interface RunnerConfiguration {
  /**
   * The runner’s description. Informational only.
   * @default "gitlab-runner"
   */
  readonly name?: string;

  /**
   * GitLab instance URL.
   * @default "https://gitlab.com"
   */
  readonly url?: string;

  /**
   * The runner’s authentication token, which is obtained during runner registration. Not the same as the registration token.
   * @see https://docs.gitlab.com/ee/api/runners.html#register-a-new-runner
   */
  readonly token?: string;

  /**
   * When using HTTPS, file that contains the certificates to verify the peer. See Self-signed certificates or custom Certification Authorities documentation.
   */
  readonly tlsCaFile?: string;

  /**
   * When using HTTPS, file that contains the certificate to authenticate with the peer.
   */
  readonly tlsCertFile?: string;

  /**
   * When using HTTPS, file that contains the private key to authenticate with the peer.
   */
  readonly tlsKeyFile?: string;

  /**
   * Limit how many jobs can be handled concurrently by this registered runner. 0 (default) means do not limit.
   * @default 10
   */
  readonly limit?: number;

  /**
   * Select how a project should be built.
   * @default "docker+machine"
   */
  readonly executor?: Executor;

  /**
   * Name of shell to generate the script. Default value is platform dependent.
   */
  readonly shell?: string;

  /**
   * Absolute path to a directory where builds are stored in the context of the selected executor. For example, locally, Docker, or SSH.
   */
  readonly buildsDir?: string;

  /**
   * Absolute path to a directory where build caches are stored in context of selected executor. For example, locally, Docker, or SSH. If the docker executor is used, this directory needs to be included in its volumes parameter.
   */
  readonly cacheDir?: string;

  /**
   * Append or overwrite environment variables.
   * @default ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"]
   */
  readonly environment?: string[];

  /**
   * Limit number of concurrent requests for new jobs from GitLab. Default is 1.
   */
  readonly requestConcurrency?: number;

  /**
   * Maximum build log size in kilobytes. Default is 4096 (4MB).
   * @default 52428800 (50GB)
   */
  readonly outputLimit?: number;

  /**
   * Commands to be executed on the runner before cloning the Git repository. Use it to adjust the Git client configuration first, for example. To insert multiple commands, use a (triple-quoted) multi-line string or \n character.
   */
  readonly preCloneScript?: string;

  /**
   * Commands to be executed on the runner after cloning the Git repository, but before executing the build. To insert multiple commands, use a (triple-quoted) multi-line string or \n character.
   */
  readonly preBuildScript?: string;

  /**
   * 	Commands to be executed on the runner just after executing the build, but before executing after_script. To insert multiple commands, use a (triple-quoted) multi-line string or \n character.
   */
  readonly postBuildScript?: string;

  /**
   * 	Overwrite the URL for the GitLab instance. Used only if the runner can’t connect to the GitLab URL.
   */
  readonly cloneUrl?: string;

  /**
   * Disables the CI_DEBUG_TRACE feature. When set to true, then debug log (trace) remains disabled, even if CI_DEBUG_TRACE is set to true by the user.
   */
  readonly debugTraceDisabled?: boolean;

  /**
   * Extra job monitoring workers that pass their results as job artifacts to GitLab.
   */
  readonly referees?: string;

  /**
   * The runner's docker configuration.
   *
   * @see https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section
   */
  readonly docker?: DockerConfiguration;

  /**
   * The runner's Docker Machine configuration.
   *
   * @see https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section
   */
  readonly machine?: MachineConfiguration;

  /**
   * The runner's AWS S3 cache configuration
   *
   * @see https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section
   */
  readonly cache?: CacheConfiguration;
}

export type Executor = "docker+machine" | "docker";
