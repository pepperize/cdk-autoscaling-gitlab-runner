import {
  CacheConfiguration,
  GlobalConfiguration,
  RunnersConfiguration,
} from "./configuration.types";

export type DefaultConfiguration =
  | Omit<GlobalConfiguration, "runners"> & {
      runners: Omit<RunnersConfiguration, "token" | "cache">[] &
        { cache: Omit<CacheConfiguration, "s3"> }[];
    };

export const defaultConfiguration: DefaultConfiguration = {
  concurrent: 10,
  check_interval: 0,
  runners: [
    {
      name: "gitlab-runner",
      url: "https://gitlab.com",
      limit: 10,
      output_limit: 52428800,
      docker: {
        tls_verify: false,
        image: "docker:19.03.5",
        privileged: true,
        cap_add: ["CAP_SYS_ADMIN"],
        wait_for_services_timeout: 300,
        disable_cache: false,
        volumes: ["/certs/client", "/cache"],
        shm_size: 0,
      },
      cache: {
        Type: "s3",
        Shared: true,
        s3: {},
      },
      machine: {
        IdleCount: 0,
        IdleTime: 300,
        MaxBuilds: 20,
        MachineDriver: "amazonec2",
        MachineName: "gitlab-runner",
        autoscaling: [],
      },
    },
  ],
};
