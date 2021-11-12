

const toToml = (configuration: Configuration) => {


  
  `
  concurrent = ${configuration.}
  check_interval = ${gitlabCheckInterval}
  [[runners]]
    name = "${this.stackName}"
    url = "${gitlabUrl}"
    token = "${gitlabToken}"
    executor = "docker+machine"
    limit = ${gitlabLimit}
    output_limit = 52428800
    environment = [
      "DOCKER_DRIVER=overlay2",
      "DOCKER_TLS_CERTDIR=/certs"
    ]
    [runners.docker]
      tls_verify = false
      image = "${gitlabDockerImage}"
      privileged = true
      cap_add = ["CAP_SYS_ADMIN"]
      wait_for_services_timeout = 300
      disable_cache = false
      volumes = ["/certs/client", "/cache"]
      shm_size = 0
    [runners.cache]
      Type = "s3"
      Shared = true
    [runners.cache.s3]
      ServerAddress = "s3.${this.urlSuffix}"
      BucketName = "${uniqueCacheBucketName}"
      BucketLocation = "${this.region}"
    [runners.machine]
      IdleCount = ${gitlabOffPeakIdleCount}
      IdleTime = ${gitlabOffPeakIdleTime}
      MaxBuilds = ${gitlabMaxBuilds}
      MachineDriver = "amazonec2"
      MachineName = "gitlab-runner-%s"
      MachineOptions = [
        "amazonec2-instance-type=${gitlabRunnerInstanceType}",
        "amazonec2-ami=${gitlabRunnerMachineImage?.getImage(this).imageId}",
        "amazonec2-region=${this.region}",
        "amazonec2-vpc-id=${vpc.vpcId}",
        "amazonec2-zone=${availabilityZone}",
        "amazonec2-subnet-id=${vpcSubnetId}",
        "amazonec2-security-group=${this.stackName}-RunnersSecurityGroup",
        "amazonec2-use-private-address=true",
        "amazonec2-iam-instance-profile=${
          runnersInstanceProfile.instanceProfileName
        }",
        "amazonec2-request-spot-instance=${gitlabRunnerRequestSpotInstance}",
        "amazonec2-spot-price=${gitlabRunnerSpotInstancePrice}"
      ]
      [[runners.machine.autoscaling]]
        Timezone = "${gitlabAutoscalingTimezone}"
        Periods = ["* * 11-23 * * mon-fri *"]
        IdleCount = ${gitlabAutoscalingIdleCount}
        IdleTime = ${gitlabAutoscalingIdleTime}
};

toToml();
