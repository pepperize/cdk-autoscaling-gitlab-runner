import { Duration, Stack } from "aws-cdk-lib";
import { AutoScalingGroup, IAutoScalingGroup, Signals } from "aws-cdk-lib/aws-autoscaling";
import {
  AmazonLinuxCpuType,
  AmazonLinuxEdition,
  AmazonLinuxGeneration,
  AmazonLinuxStorage,
  AmazonLinuxVirt,
  CloudFormationInit,
  IMachineImage,
  InitCommand,
  InitConfig,
  InitFile,
  InitPackage,
  InitService,
  InitServiceRestartHandle,
  InstanceClass,
  InstanceSize,
  InstanceType,
  ISecurityGroup,
  LookupMachineImage,
  MachineImage,
  Port,
  SecurityGroup,
  UserData,
} from "aws-cdk-lib/aws-ec2";
import { CfnInstanceProfile, IRole, ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import {
  GitlabRunnerAutoscalingManagerConfiguration,
  GlobalConfiguration,
  LogFormat,
  LogLevel,
} from "../runner-configuration";
import { Cache, CacheProps } from "./cache";
import { GitlabRunnerAutoscalingJobRunner, GitlabRunnerAutoscalingJobRunnerConfiguration } from "./job-runner";
import { GitlabRunnerAutoscalingManager } from "./manager";
import { Network, NetworkProps } from "./network";

/**
 * This is a AWS CDK Construct that may be used to deploy a GitLab runner with Docker executor and auto-scaling.
 *
 * @remarks
 * The `cdk-gitlab-runner` defines the {@link GitlabRunnerAutoscalingProps} interface and {@link GitlabRunnerAutoscaling} construct class,
 * which are used to provision a the runner.
 *
 * @packageDocumentation
 */

/**
 * Properties of the Gitlab Runner. You have to provide at least the GitLab's Runner's authentication token.
 */
export interface GitlabRunnerAutoscalingProps extends GlobalConfiguration {
  readonly cache?: GitlabRunnerAutoscalingCacheProps;

  /**
   * The network configuration for the Runner. If not set, the defaults will be used.
   * @link NetworkProps
   */
  readonly network?: NetworkProps;

  /**
   * The manager EC2 instance configuration. If not set, the defaults will be used.
   * @link GitlabRunnerAutoscalingManagerConfiguration
   */
  readonly manager?: GitlabRunnerAutoscalingManagerConfiguration;

  readonly runners: GitlabRunnerAutoscalingJobRunnerConfiguration[];
}

/**
 * The distributed GitLab runner S3 cache. Either pass an existing bucket or override default options.
 * @see https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section
 */
export interface GitlabRunnerAutoscalingCacheProps {
  /**
   * An existing S3 bucket used as runner's cache.
   */
  readonly bucket?: IBucket;

  /**
   * If no existing S3 bucket is provided, a S3 bucket will be created.
   */
  readonly options?: CacheProps;
}

/**
 * The Gitlab Runner autoscaling on EC2 by Docker Machine.
 *
 * @example <caption>Provisioning a basic Runner</caption>
 * const app = new cdk.App();
 * const stack = new cdk.Stack(app, "RunnerStack", {
 *   env: {
 *     account: "000000000000",
 *     region: "us-east-1",
 *   }
 * });
 *
 * new GitlabRunnerAutoscaling(stack, "GitlabRunner", {
 *   runners: [{
 *     gitlabToken: "xxxxxxxxxxxxxxxxxxxx"},
 *   }]
 * });
 */
export class GitlabRunnerAutoscaling extends Construct {
  readonly concurrent?: number;

  readonly checkInterval?: number;

  readonly logFormat?: LogFormat;

  readonly logLevel?: LogLevel;

  readonly network: Network;

  readonly cacheBucket: IBucket;

  readonly manager: GitlabRunnerAutoscalingManager;

  constructor(scope: Stack, id: string, props: GitlabRunnerAutoscalingProps) {
    super(scope, id);
    const {
      concurrent,
      checkInterval,
      logFormat,
      logLevel,
      manager,
      cache,
      runners,
      network,
    }: GitlabRunnerAutoscalingProps = props;

    /**
     * Global Configuration
     * @link GlobalConfiguration
     */
    this.concurrent = concurrent ?? 10;
    this.checkInterval = checkInterval ?? 0;
    this.logFormat = logFormat ?? "runner";
    this.logLevel = logLevel ?? "info";

    /**
     * S3 Bucket for Runners' cache
     */
    this.cacheBucket = cache?.bucket || new Cache(scope, "Cache", cache?.options).bucket;

    /**
     * Network
     */
    this.network = new Network(scope, "Network", network);

    /**
     * Security groups
     */
    const runnersSecurityGroupName = `${scope.stackName}-RunnersSecurityGroup`;
    const runnersSecurityGroup = new SecurityGroup(scope, "RunnersSecurityGroup", {
      securityGroupName: runnersSecurityGroupName,
      description: "Security group for GitLab Runners.",
      vpc: this.network.vpc,
    });
    const managerSecurityGroup = new SecurityGroup(scope, "ManagerSecurityGroup", {
      vpc: this.network.vpc,
      description: "Security group for GitLab Runners Manager.",
    });
    managerSecurityGroup.connections.allowTo(runnersSecurityGroup, Port.tcp(22), "SSH traffic from Manager");
    managerSecurityGroup.connections.allowTo(runnersSecurityGroup, Port.tcp(2376), "SSH traffic from Docker");

    /**
     * GitLab Manager
     */
    this.manager = new GitlabRunnerAutoscalingManager(scope, "Manager", {
      ...manager,
      globalConfiguration: {
        concurrent: this.concurrent,
        checkInterval: this.checkInterval,
        logFormat: this.logFormat,
        logLevel: this.logLevel,
      },
      runnersSecurityGroupName: runnersSecurityGroupName,
      network: this.network,
      cacheBucket: this.cacheBucket,
      runners: runners.map((runnerProps, index): GitlabRunnerAutoscalingJobRunner => {
        return new GitlabRunnerAutoscalingJobRunner(scope, `GitlabRunnerAutoscalingJobRunner${index}`, {
          name: `gitlab-runner-${index}`,
          ...runnerProps,
        });
      }),
    });

    new AutoScalingGroup(scope, "ManagerAutoscalingGroup", {
      vpc: this.network.vpc,
      vpcSubnets: {
        subnets: [this.network.subnet],
      },
      instanceType: this.manager.instanceType,
      machineImage: this.manager.machineImage,
      keyName: this.manager.keyPairName,
      securityGroup: managerSecurityGroup,
      role: this.manager.role,
      userData: this.manager.userData,
      init: this.manager.initConfig,
      initOptions: {
        ignoreFailures: false,
      },
      maxCapacity: 1,
      minCapacity: 1,
      desiredCapacity: 1,
      signals: Signals.waitForCount(1, { timeout: Duration.minutes(15) }),
    });
  }
}
