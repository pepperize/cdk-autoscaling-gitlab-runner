export interface MachineOptions {
  readonly instanceType?: string;
  readonly ami?: string;
  readonly region?: string;
  readonly vpcId?: string;
  /**
   * Extract the availabilityZone last character for the needs of gitlab configuration
   *
   * @see {@link https://docs.gitlab.com/runners/configuration/runners_autoscale_aws/#the-runnerssmachine-section}
   */
  readonly zone?: string;
  readonly subnetId?: string;
  /**
   * The SecurityGroup's GroupName, not the GroupId.
   */
  readonly securityGroup?: string;
  readonly usePrivateAddress?: boolean;
  readonly iamInstanceProfile?: string;
  /**
   * The amazonec2-request-spot-instance parameter. Whether or not to request spot instances.
   * @see {@link https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances}
   * @see {@link https://aws.amazon.com/ec2/spot/}
   * @default true
   */
  readonly requestSpotInstance?: boolean;
  /**
   * The amazonec2-spot-price parameter. The bidding price for spot instances.
   * @see {@link https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances}
   * @see {@link https://aws.amazon.com/ec2/spot/pricing/}
   * @default 0.03
   */
  readonly spotPrice?: number;
  /**
   * The amazonec2-block-duration-minutes parameter. AWS spot instance duration in minutes (60, 120, 180, 240, 300, or 360).
   * @see {@link https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances}
   */
  readonly blockDurationMinutes?: number;
}
