import { stringify } from "@iarna/toml";
import { GlobalConfiguration } from "./configuration.types";

export const toToml = (configuration: GlobalConfiguration) => {
  return stringify(configuration);
};
