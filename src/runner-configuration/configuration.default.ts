import {
  AutoscalingConfiguration,
  CacheConfiguration,
  DockerConfiguration,
  GlobalConfiguration,
  MachineConfiguration,
  RunnersConfiguration,
} from "./configuration.types";

// Cache
export const defaultCacheConfiguration: CacheConfiguration = {
  Type: "s3",
  Shared: true,
} as CacheConfiguration;

// Docker
export const defaultDockerConfiguration: DockerConfiguration = {
  tls_verify: false,
  image: "docker:19.03.5",
  privileged: true,
  cap_add: ["CAP_SYS_ADMIN"],
  wait_for_services_timeout: 300,
  disable_cache: false,
  volumes: ["/certs/client", "/cache"],
  shm_size: 0,
};

// Machine autoscaling
export const defaultAutoscalingConfiguration: AutoscalingConfiguration = {
  Periods: ["* * 7-22 * * mon-fri *"],
  IdleCount: 1,
  IdleTime: 1800,
  Timezone: "Etc/UTC",
};

// Machine
export const defaultMachineConfiguration: MachineConfiguration = {
  IdleCount: 0,
  IdleTime: 300,
  MaxBuilds: 20,
  MachineDriver: "amazonec2",
  MachineName: "gitlab-runner-%s",
  autoscaling: [defaultAutoscalingConfiguration],
} as MachineConfiguration;

// Runners
export const defaultRunnerConfiguration: RunnersConfiguration = {
  name: "gitlab-runner",
  url: "https://gitlab.com",
  limit: 10,
  output_limit: 52428800,
  executor: "docker+machine",
  environment: ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"],
  docker: defaultDockerConfiguration,
  cache: defaultCacheConfiguration,
  machine: defaultMachineConfiguration,
} as RunnersConfiguration;

// Global
export const defaultConfiguration: GlobalConfiguration = {
  concurrent: 10,
  check_interval: 0,
  log_format: "runner",
  log_level: "info",
  runners: [defaultRunnerConfiguration],
};
