export interface CacheConfiguration {
  readonly type?: "s3";
  readonly shared?: boolean;
  readonly s3?: CacheS3Configuration;
}

/**
 * Define cache configuration for S3 storage.
 *
 * @see https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section
 */
export interface CacheS3Configuration {
  /**
   * The AWS S3 host.
   * @default "s3.amazonaws.com"
   */
  readonly serverAddress?: string;
  /**
   * The name of the storage bucket where cache is stored.
   * @default "runners-cache"
   */
  readonly bucketName?: string;
  /**
   * The name of the S3 region.
   */
  readonly bucketLocation?: string;
  /**
   * In GitLab 15.0 and later, explicitly set AuthenticationType to iam or access-key.
   *
   * @see https://gitlab.com/gitlab-org/gitlab-runner/-/blob/main/common/config.go#L869
   * @see https://gitlab.com/gitlab-org/gitlab-runner/-/issues/28171
   *
   * @default "iam"
   */
  readonly authenticationType?: CacheS3AuthType;
  /**
   * Set to true if the S3 service is available by HTTP.
   *
   * @default false
   */
  readonly insecure?: boolean;
  readonly accessKey?: string;
  readonly secretKey?: string;
}

export type CacheS3AuthType = "access-key" | "iam";
