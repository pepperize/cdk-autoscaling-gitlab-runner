import { AnyJson, JsonMap, stringify } from "@iarna/toml";
import { paramCase } from "param-case";
import { pascalCase } from "pascal-case";
import { snakeCase } from "snake-case";
import { GlobalConfiguration } from "./global-configuration";
import { RunnerConfiguration } from "./runner-configuration";

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
      runnersConfiguration: runnersConfiguration.map((runnerConfiguration) => {
        return {
          name: "gitlab-runner",
          url: "https://gitlab.com",
          limit: 10,
          outputLimit: 52428800,
          executor: "docker+machine",
          environment: ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"],
          ...runnerConfiguration,
          docker: {
            tlsVerify: false,
            image: "docker:19.03.5",
            privileged: true,
            capAdd: ["CAP_SYS_ADMIN"],
            waitForServicesTimeout: 300,
            disableCache: false,
            volumes: ["/certs/client", "/cache"],
            shmSize: 0,
            ...runnerConfiguration.docker,
          },
          machine: {
            idleCount: 0,
            idleTime: 300,
            maxBuilds: 20,
            machineDriver: "amazonec2",
            machineName: "gitlab-runner-%s",
            ...runnerConfiguration.machine,
            machineOptions: {
              requestSpotInstance: true,
              spotPrice: 0.03,
              ...runnerConfiguration.machine.machineOptions,
            },
            autoscaling: runnerConfiguration.machine.autoscaling?.length
              ? runnerConfiguration.machine.autoscaling
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
            ...runnerConfiguration.cache,
            s3: { ...runnerConfiguration.cache?.s3 },
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
      }

      runner.machine = toJsonMap(config.machine, pascalCase);
      runner.machine.MachineOptions = toProperties(
        config.machine.machineOptions,
        (key) => `amazonec2-${paramCase(key)}`
      );
      if (config.machine.autoscaling) {
        runner.machine.autoscaling = config.machine.autoscaling.map((autoscaling) =>
          toJsonMap(autoscaling, pascalCase)
        );
      }

      if (config.cache) {
        runner.cache = toJsonMap({ type: "s3", ...config.cache }, pascalCase);
        runner.cache.s3 = toJsonMap(config.cache.s3, pascalCase);
      }

      result.runners.push(runner);
    }

    return result;
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
