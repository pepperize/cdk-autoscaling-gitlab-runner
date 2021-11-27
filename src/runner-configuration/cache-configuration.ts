export interface CacheConfiguration {
  readonly type?: "s3";
  readonly shared?: boolean;
  readonly s3?: CacheS3Configuration;
}

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
  readonly accessKey?: string;
  readonly secretKey?: string;
}
