/**
 * Configure the Docker Machine-based autoscaling feature.
 * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachine-section}
 * @see {@link https://docs.gitlab.com/runner/configuration/autoscale.html#how-concurrent-limit-and-idlecount-generate-the-upper-limit-of-running-machines}
 */
import { MachineOptions } from "./machine-options";

export interface MachineConfiguration {
  /**
   * @default 0
   */
  readonly idleCount?: number;
  /**
   * @default 300
   */
  readonly idleTime?: number;
  /**
   * @default 20
   */
  readonly maxBuilds?: number;
  /**
   * @default "amazonec2"
   */
  readonly machineDriver?: MachineDriver;
  /**
   * @default "gitlab-runner"
   */
  readonly machineName?: string;
  readonly machineOptions?: MachineOptions;
}

export type MachineDriver = "amazonec2" | string;
