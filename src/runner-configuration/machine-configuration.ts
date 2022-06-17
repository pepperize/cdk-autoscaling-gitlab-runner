/**
 * Configure the Docker Machine-based autoscaling feature.
 *
 * @see https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachine-section
 * @see https://docs.gitlab.com/runner/configuration/autoscale.html#how-concurrent-limit-and-idlecount-generate-the-upper-limit-of-running-machines
 */
import { AutoscalingConfiguration } from "./autoscaling-configuration";
import { MachineOptions } from "./machine-options";

export interface MachineConfiguration {
  /**
   * Number of machines that need to be created and waiting in Idle state.
   *
   * @default 0
   */
  readonly idleCount?: number;
  /**
   * Time (in seconds) for machine to be in Idle state before it is removed.
   *
   * @default 300
   */
  readonly idleTime?: number;
  /**
   * Maximum job (build) count before machine is removed.
   *
   * @default 20
   */
  readonly maxBuilds?: number;
  /**
   * Docker Machine driver.
   *
   * @default "amazonec2"
   */
  readonly machineDriver?: MachineDriver;
  /**
   * @default "gitlab-runner"
   */
  readonly machineName?: string;
  /**
   * Docker Machine options passed to the Docker Machine driver.
   */
  readonly machineOptions?: MachineOptions;

  readonly autoscaling?: AutoscalingConfiguration[];

  /**
   * The path of the runner machine's userdata file on the manager instance used by the amazonec2 driver to create a new instance.
   *
   * @see https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/
   * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go
   *
   * @default /etc/gitlab-runner/user_data_runners
   */
  readonly userData?: string;
}

export type MachineDriver = "amazonec2" | string;
