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
  checkInterval: 0,
  runners: [
    {
      name: "gitlab-runner",
      url: "https://gitlab.com",
      limit: 10,
      outputLimit: 52428800,
      docker: {
        image: "docker:19.03.5",
      },
      machine: {
        idleCount: 0,
        idleTime: 300,
        maxBuilds: 20,
        machineName: "gitlab-runner",
        autoscaling: [],
      },
    }
  ],
};
