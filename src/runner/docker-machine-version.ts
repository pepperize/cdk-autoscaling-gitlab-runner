/**
 * Docker+machine version
 *
 * @see https://gitlab.com/gitlab-org/ci-cd/docker-machine
 */
export class DockerMachineVersion {
  /**
   * Docker+machine version 0.16.2-gitlab.15
   */
  public static readonly V0_16_2_GITLAB_15 = new DockerMachineVersion("v0.16.2-gitlab.15");

  /**
   * Custom docker+machine version
   * @param version docker+machine version number
   */
  public static of(version: string) {
    return new DockerMachineVersion(version);
  }
  public readonly version: string;

  private constructor(version: string) {
    this.version = version;
  }
}
