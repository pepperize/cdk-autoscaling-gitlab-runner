import {
  GlobalConfiguration,
  RunnersConfiguration,
} from "./configuration.types";

export type DefaultConfiguration =
  | Omit<GlobalConfiguration, "runners"> & {
      runners: Omit<RunnersConfiguration, "token" | "cache">[];
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
        image: "docker:19.03.5",
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
