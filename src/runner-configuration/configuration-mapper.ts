import { AnyJson, JsonArray, JsonMap, stringify } from "@iarna/toml";
import { paramCase } from "param-case";
import { pascalCase } from "pascal-case";
import { snakeCase } from "snake-case";
import { GlobalConfiguration } from "./global-configuration";
import { RunnerConfiguration } from "./runner-configuration";
import { MachineOptions } from "./machine-options";

export interface ConfigurationMapperProps {
  readonly globalConfiguration: GlobalConfiguration;
  readonly runnersConfiguration: RunnerConfiguration[];
}

export class ConfigurationMapper {
  public static withDefaults(props: ConfigurationMapperProps) {
    const { globalConfiguration, runnersConfiguration } = props;

    return new ConfigurationMapper({
      globalConfiguration: {
        concurrent: 10,
        checkInterval: 0,
        logFormat: "runner",
        logLevel: "info",
        ...globalConfiguration,
      },
      runnersConfiguration: runnersConfiguration.map((item): RunnerConfiguration => {
        return {
          name: "gitlab-runner",
          url: "https://gitlab.com",
          limit: 10,
          outputLimit: 52428800,
          executor: "docker+machine",
          environment: ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"],
          ...item,
          docker: {
            tlsVerify: false,
            image: "docker:19.03.5",
            privileged: true,
            capAdd: ["CAP_SYS_ADMIN"],
            waitForServicesTimeout: 300,
            disableCache: false,
            volumes: ["/certs/client", "/cache"],
            shmSize: 0,
            ...item.docker,
          },
          machine: {
            idleCount: 0,
            idleTime: 300,
            maxBuilds: 20,
            machineDriver: "amazonec2",
            machineName: "gitlab-runner-%s",
            ...item.machine,
            machineOptions: {
              requestSpotInstance: true,
              spotPrice: 0.03,
              ...item.machine.machineOptions,
            },
            autoscaling: item.machine.autoscaling?.length
              ? item.machine.autoscaling
              : [
                  {
                    periods: ["* * 7-22 * * mon-fri *"],
                    idleCount: 1,
                    idleTime: 1800,
                    timezone: "Etc/UTC",
                  },
                ],
          },
          cache: {
            type: "s3",
            shared: true,
            ...item.cache,
          },
        };
      }),
    });
  }

  public static fromProps(props: ConfigurationMapperProps) {
    return new ConfigurationMapper(props);
  }

  private constructor(readonly props: ConfigurationMapperProps) {}

  public toToml(): string {
    return stringify(this._toJsonMap());
  }

  /**
   * @internal
   */
  public _toJsonMap(): JsonMap {
    const { globalConfiguration, runnersConfiguration } = this.props;

    const result: JsonMap = toJsonMap(globalConfiguration, snakeCase);

    result.runners = [] as JsonMap[];
    for (const config of runnersConfiguration) {
      const runner: JsonMap = toJsonMap(config, snakeCase);

      // Fix naming convention inconsistencies
      runner["tls-ca-file"] = runner.tls_ca_file;
      delete runner.tls_ca_file;
      runner["tls-cert-file"] = runner.tls_cert_file;
      delete runner.tls_ca_file;
      runner["tls-key-file"] = runner.tls_key_file;
      delete runner.tls_ca_file;

      if (config.docker) {
        runner.docker = toJsonMap(config.docker, snakeCase);
      } else {
        delete runner.docker;
      }

      runner.machine = toJsonMap(config.machine, pascalCase);
      if (config.machine.machineOptions) {
        const machineOptions = this._mapMachineOptions(config.machine.machineOptions);

        if (machineOptions.length) {
          runner.machine.MachineOptions = machineOptions;
        }
      }
      if (config.machine.autoscaling) {
        runner.machine.autoscaling = config.machine.autoscaling.map((autoscaling) =>
          toJsonMap(autoscaling, pascalCase)
        );
      } else {
        delete runner.machine.autoscaling;
      }

      if (config.cache && config.cache.s3) {
        runner.cache = toJsonMap({ type: "s3", ...config.cache }, pascalCase);
        runner.cache.s3 = toJsonMap(config.cache.s3, pascalCase);
      } else {
        delete runner.cache;
      }

      if (Object.keys(runner).length) {
        result.runners.push(runner);
      }
    }

    if (result.runners.length == 0) {
      delete result.runners;
    }

    return filter(result, (item) => !isEmpty(item)) as JsonMap;
  }

  private _mapMachineOptions(machineOptions: MachineOptions): string[] {
    return toProperties(machineOptions, (key) => `amazonec2-${paramCase(key)}`);
  }
}

/**
 * Transforms configuration objects to JsonMap. Pass an inflector function to transform object keys.
 *
 * @param configuration
 * @param inflector A function to transform the object key
 */
function toJsonMap<T>(configuration: T, inflector: (s: string) => string): JsonMap {
  const result: JsonMap = {};
  for (const key in configuration) {
    const value = configuration[key] as unknown as AnyJson;
    if (value === undefined) {
      continue;
    }
    result[inflector(key)] = value;
  }

  return result;
}

/**
 * Transforms configuration objects to a property array. Pass an inflector function to transform object keys.
 *
 * @param configuration
 * @param inflector A function to transform the object key
 * @example
 * // returns ["foo=bar"]
 * toProperties({foo: "bar", (s) => s});
 */
function toProperties<T>(configuration: T, inflector: (s: string) => string): string[] {
  const result = [];
  for (const key in configuration) {
    const value = configuration[key] as unknown as AnyJson;
    if (value === undefined) {
      continue;
    }
    result.push(`${inflector(key)}=${value}`);
  }

  return result;
}

function isEmpty(subject: AnyJson): boolean {
  if (Array.isArray(subject)) {
    return !subject.length;
  }
  if (typeof subject === "object" && !(subject instanceof Date)) {
    return !Object.keys(subject).length;
  }
  if (subject === undefined) {
    return true;
  }
  if (subject === null) {
    return true;
  }

  return false;
}

function filter(subject: AnyJson, predicate: (value: AnyJson) => boolean): AnyJson {
  if (Array.isArray(subject)) {
    const result: Array<AnyJson> = [];

    subject.forEach((element: AnyJson): void => {
      const filtered = filter(element, predicate);

      if (predicate.call(subject, element)) {
        result.push(filtered);
      }
    });

    return result as JsonArray;
  }

  if (typeof subject === "object" && !(subject instanceof Date)) {
    const result: JsonMap = {};

    for (const key in subject) {
      let value: AnyJson = subject[key];
      value = filter(value, predicate);

      if (predicate.call(subject, value)) {
        result[key] = value;
      }
    }

    return result;
  }

  return subject;
}
