/**
 * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/commands/create.go
 */
export interface SharedCreateOptions {
  /**
   * Custom URL to use for engine installation
   *
   * @default https://releases.rancher.com/install-docker/20.10.21.sh
   */
  readonly engineInstallUrl?: string;
}

/**
 * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/docs/drivers/aws.md#options
 * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go
 */
export interface MachineOptions extends SharedCreateOptions {
  readonly instanceType?: string;
  readonly ami?: string;
  readonly region?: string;
  readonly vpcId?: string;
  /**
   * Extract the availabilityZone last character for the needs of gitlab configuration
   *
   * @see https://docs.gitlab.com/runners/configuration/runners_autoscale_aws/#the-runnerssmachine-section
   */
  readonly zone?: string;
  readonly subnetId?: string;
  /**
   * The SecurityGroup's GroupName, not the GroupId.
   */
  readonly securityGroup?: string;
  /**
   * The amazonec2-private-address-only parameter. If true, your EC2 instance won’t get assigned a public IP. This is ok if your VPC is configured correctly with an Internet Gateway (IGW), NatGateway (NGW) and routing is fine, but it’s something to consider if you’ve got a more complex configuration.
   *
   * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go#L651
   * @see https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section
   */
  readonly privateAddressOnly?: boolean;
  /**
   * Use the private IP address of Docker Machines, but still create a public IP address. Useful to keep the traffic internal and avoid extra costs.
   *
   * @see https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section
   */
  readonly usePrivateAddress?: boolean;
  readonly iamInstanceProfile?: string;
  /**
   * The amazonec2-request-spot-instance parameter. Whether or not to request spot instances.
   * @see https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances
   * @see https://aws.amazon.com/ec2/spot/
   * @default true
   */
  readonly requestSpotInstance?: boolean;
  /**
   * The amazonec2-spot-price parameter. The bidding price for spot instances.
   * @see https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances
   * @see https://aws.amazon.com/ec2/spot/pricing/
   * @default 0.03
   */
  readonly spotPrice?: number;
  /**
   * The amazonec2-block-duration-minutes parameter. AWS spot instance duration in minutes (60, 120, 180, 240, 300, or 360).
   * @see https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances
   */
  readonly blockDurationMinutes?: number;
  /**
   * The root disk size of the instance (in GB).
   * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/docs/drivers/aws.md#options
   * @default 16
   */
  readonly rootSize?: number;
  /**
   * The amazonec2-ssh-keypath parameter.
   *
   * @default /etc/gitlab-runner/ssh
   */
  readonly sshKeypath?: string;
  /**
   * The amazonec2-keypair-name parameter. A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance.
   *
   * <b>using --amazonec2-keypair-name also requires --amazonec2-ssh-keypath</b>
   *
   * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go#L398
   */
  readonly keypairName?: string;
  /**
   * The Amazon EBS volume type to be attached to the instance.
   * @default gp2
   */
  readonly volumeType?: string;
  /**
   * Create an EBS Optimized Instance, instance type must support it.
   */
  readonly useEbsOptimizedInstance?: boolean;
  /**
   * Whether the metadata token is required or optional.
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html
   * @default required
   */
  readonly metadataToken?: string;
  /**
   * The number of network hops that the metadata token can travel.
   * @default 2
   */
  readonly metadataTokenResponseHopLimit?: number;
  /**
   * The path of the runner machine's userdata file on the manager instance used by the amazonec2 driver to create a new instance.
   *
   * @see https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/
   * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go
   *
   * @default /etc/gitlab-runner/user_data_runners
   */
  readonly userdata?: string;
}
