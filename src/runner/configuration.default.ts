import {
  AutoscalingConfiguration,
  CacheConfiguration,
  GlobalConfiguration,
  MachineConfiguration,
  RunnersConfiguration,
} from "./configuration.types";

// Cache
export type DefaultCacheConfiguration = Omit<CacheConfiguration, "s3">;
export const defaultCacheConfiguration: DefaultCacheConfiguration = {
  Type: "s3",
  Shared: true,
};

// Docker
export const defaultDockerConfiguration = {
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
};

// Runners
export type DefaultRunnersConfiguration = Omit<
  RunnersConfiguration,
  "token" | "cache"
>[] &
  { cache: DefaultCacheConfiguration }[];
export const defaultRunnersConfiguration = {
  name: "gitlab-runner",
  url: "https://gitlab.com",
  limit: 10,
  output_limit: 52428800,
  executor: "docker+machine",
  environment: ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"],
  docker: defaultDockerConfiguration,
  cache: defaultCacheConfiguration,
  machine: defaultMachineConfiguration,
};

// Global
export type DefaultGlobalConfiguration =
  | Omit<GlobalConfiguration, "runners"> & {
      runners: DefaultRunnersConfiguration;
    };
export const defaultConfiguration: DefaultGlobalConfiguration = {
  concurrent: 10,
  check_interval: 0,
  runners: [defaultRunnersConfiguration],
};
