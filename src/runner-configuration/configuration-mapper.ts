import { AnyJson, JsonMap, stringify } from "@iarna/toml";
import { paramCase } from "param-case";
import { pascalCase } from "pascal-case";
import { snakeCase } from "snake-case";
import { AutoscalingConfiguration } from "./autoscaling-configuration";
import { CacheConfiguration } from "./cache-configuration";
import { DockerConfiguration } from "./docker-configuration";
import { GlobalConfiguration } from "./global-configuration";
import { MachineConfiguration } from "./machine-configuration";
import { RunnerConfiguration } from "./runner-configuration";

export interface ConfigurationMapperProps {
  readonly globalConfiguration: GlobalConfiguration;
  readonly runnerConfiguration: RunnerConfiguration;
  readonly dockerConfiguration: DockerConfiguration;
  readonly machineConfiguration: MachineConfiguration;
  readonly autoscalingConfigurations: AutoscalingConfiguration[];
  readonly cacheConfiguration: CacheConfiguration;
}

export class ConfigurationMapper {
  public static withDefaults(props: ConfigurationMapperProps) {
    const {
      globalConfiguration,
      runnerConfiguration,
      dockerConfiguration,
      machineConfiguration,
      autoscalingConfigurations,
      cacheConfiguration,
    } = props;

    return new ConfigurationMapper({
      globalConfiguration: {
        concurrent: 10,
        checkInterval: 0,
        logFormat: "runner",
        logLevel: "info",
        ...globalConfiguration,
      },
      runnerConfiguration: {
        name: "gitlab-runner",
        url: "https://gitlab.com",
        limit: 10,
        outputLimit: 52428800,
        executor: "docker+machine",
        environment: ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"],
        ...runnerConfiguration,
      },
      dockerConfiguration: {
        tlsVerify: false,
        image: "docker:19.03.5",
        privileged: true,
        capAdd: ["CAP_SYS_ADMIN"],
        waitForServicesTimeout: 300,
        disableCache: false,
        volumes: ["/certs/client", "/cache"],
        shmSize: 0,
        ...dockerConfiguration,
      },
      machineConfiguration: {
        idleCount: 0,
        idleTime: 300,
        maxBuilds: 20,
        machineDriver: "amazonec2",
        machineName: "gitlab-runner-%s",
        ...machineConfiguration,
        machineOptions: {
          requestSpotInstance: true,
          spotPrice: 0.03,
          ...machineConfiguration.machineOptions,
        },
      },
      autoscalingConfigurations: autoscalingConfigurations.length
        ? autoscalingConfigurations
        : [
            {
              periods: ["* * 7-22 * * mon-fri *"],
              idleCount: 1,
              idleTime: 1800,
              timezone: "Etc/UTC",
            },
          ],
      cacheConfiguration: {
        type: "s3",
        shared: true,
        ...cacheConfiguration,
      },
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
    const {
      globalConfiguration,
      runnerConfiguration,
      dockerConfiguration,
      machineConfiguration,
      autoscalingConfigurations,
      cacheConfiguration,
    } = this.props;

    const result: JsonMap = toJsonMap(globalConfiguration, snakeCase);

    const runner: JsonMap = toJsonMap(runnerConfiguration, snakeCase);
    result.runners = [runner];

    runner.docker = toJsonMap(dockerConfiguration, snakeCase);

    const machine = toJsonMap(machineConfiguration, pascalCase);
    machine.MachineOptions = toProperties(machineConfiguration.machineOptions, (key) => `amazonec2-${paramCase(key)}`);
    machine.autoscaling = autoscalingConfigurations.map((autoscaling) => toJsonMap(autoscaling, pascalCase));
    runner.machine = machine;

    const cache = toJsonMap(cacheConfiguration, pascalCase);
    delete cache.S3;
    cache.s3 = toJsonMap(cacheConfiguration.s3, pascalCase);
    runner.cache = cache;

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
