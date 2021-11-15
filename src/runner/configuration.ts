import { JsonMap, stringify } from "@iarna/toml";

export type RunnerConfiguration = {
  [key: "concurrent" | "check_interval" | string]: number;
};

export const toToml = (configuration: RunnerConfiguration) => {
  return stringify(configuration as JsonMap);
};
