/**
 * You can change the behavior of GitLab Runner and of individual registered runners.
 * This imitates the structure of Gitlab Runner advanced configuration that originally is set with config.toml file.
 * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html}
 */
export interface GlobalConfiguration {
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
   * @default "runner"
   */
  readonly logFormat?: LogFormat;

  /**
   * The log_level
   * @default "info"
   */
  readonly logLevel?: LogLevel;
}

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal" | "panic";

export type LogFormat = "runner" | "text" | "json";
