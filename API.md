# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Cache <a name="@pepperize/cdk-autoscaling-gitlab-runner.Cache"></a>

A GitLab Runner cache consisting of an Amazon S3 bucket.

The bucket is encrypted with a KMS managed master key, it has public access blocked and will be cleared and deleted on CFN stack deletion.

#### Initializers <a name="@pepperize/cdk-autoscaling-gitlab-runner.Cache.Initializer"></a>

```typescript
import { Cache } from '@pepperize/cdk-autoscaling-gitlab-runner'

new Cache(scope: Stack, id: string, props?: CacheProps)
```

##### `scope`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Cache.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Stack`](#@aws-cdk/core.Stack)

---

##### `id`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Cache.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Cache.parameter.props"></a>

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.CacheProps`](#@pepperize/cdk-autoscaling-gitlab-runner.CacheProps)

---



#### Properties <a name="Properties"></a>

##### `bucket`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Cache.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* [`@aws-cdk/aws-s3.IBucket`](#@aws-cdk/aws-s3.IBucket)

---

##### `expiration`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Cache.property.expiration"></a>

```typescript
public readonly expiration: Duration;
```

- *Type:* [`@aws-cdk/core.Duration`](#@aws-cdk/core.Duration)

---

##### `lifeCycleRuleEnabled`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Cache.property.lifeCycleRuleEnabled"></a>

```typescript
public readonly lifeCycleRuleEnabled: boolean;
```

- *Type:* `boolean`

---


### GitlabRunnerAutoscaling <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling"></a>

The Gitlab Runner autoscaling on EC2 by Docker Machine.

#### Initializers <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.Initializer"></a>

```typescript
import { GitlabRunnerAutoscaling } from '@pepperize/cdk-autoscaling-gitlab-runner'

new GitlabRunnerAutoscaling(scope: Stack, id: string, props: GitlabRunnerAutoscalingProps)
```

##### `scope`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Stack`](#@aws-cdk/core.Stack)

---

##### `id`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.parameter.props"></a>

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps`](#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps)

---



#### Properties <a name="Properties"></a>

##### `cacheBucket`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.cacheBucket"></a>

```typescript
public readonly cacheBucket: IBucket;
```

- *Type:* [`@aws-cdk/aws-s3.IBucket`](#@aws-cdk/aws-s3.IBucket)

---

##### `manager`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.manager"></a>

```typescript
public readonly manager: GitlabRunnerAutoscalingManager;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager`](#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager)

---

##### `network`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.network"></a>

```typescript
public readonly network: Network;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.Network`](#@pepperize/cdk-autoscaling-gitlab-runner.Network)

---

##### `runners`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.runners"></a>

```typescript
public readonly runners: GitlabRunnerAutoscalingRunners;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunners`](#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunners)

---


### Network <a name="@pepperize/cdk-autoscaling-gitlab-runner.Network"></a>

Network settings for the manager and runners.

All EC2 instances should belong to the same subnet, availability zone and vpc.

#### Initializers <a name="@pepperize/cdk-autoscaling-gitlab-runner.Network.Initializer"></a>

```typescript
import { Network } from '@pepperize/cdk-autoscaling-gitlab-runner'

new Network(scope: Stack, id: string, props?: NetworkProps)
```

##### `scope`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Network.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Stack`](#@aws-cdk/core.Stack)

---

##### `id`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Network.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Network.parameter.props"></a>

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps`](#@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps)

---



#### Properties <a name="Properties"></a>

##### `availabilityZone`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Network.property.availabilityZone"></a>

```typescript
public readonly availabilityZone: string;
```

- *Type:* `string`

---

##### `subnet`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Network.property.subnet"></a>

```typescript
public readonly subnet: ISubnet;
```

- *Type:* [`@aws-cdk/aws-ec2.ISubnet`](#@aws-cdk/aws-ec2.ISubnet)

---

##### `vpc`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Network.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* [`@aws-cdk/aws-ec2.IVpc`](#@aws-cdk/aws-ec2.IVpc)

---


## Structs <a name="Structs"></a>

### AutoscalingConfiguration <a name="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration"></a>

> {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections}

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { AutoscalingConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const autoscalingConfiguration: AutoscalingConfiguration = { ... }
```

##### `idleCount`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.idleCount"></a>

```typescript
public readonly idleCount: number;
```

- *Type:* `number`

---

##### `idleTime`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.idleTime"></a>

```typescript
public readonly idleTime: number;
```

- *Type:* `number`

---

##### `periods`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.periods"></a>

```typescript
public readonly periods: string[];
```

- *Type:* `string`[]

The Periods setting contains an array of string patterns of time periods represented in a cron-style format. https://github.com/gorhill/cronexpr#implementation.

[second] [minute] [hour] [day of month] [month] [day of week] [year]

---

##### `timezone`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.timezone"></a>

```typescript
public readonly timezone: string;
```

- *Type:* `string`

---

### CacheConfiguration <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { CacheConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const cacheConfiguration: CacheConfiguration = { ... }
```

##### `s3`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.property.s3"></a>

```typescript
public readonly s3: CacheS3Configuration;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration`](#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration)

---

##### `shared`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.property.shared"></a>

```typescript
public readonly shared: boolean;
```

- *Type:* `boolean`

---

##### `type`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* `string`

---

### CacheProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { CacheProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const cacheProps: CacheProps = { ... }
```

##### `bucketName`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheProps.property.bucketName"></a>

```typescript
public readonly bucketName: string;
```

- *Type:* `string`
- *Default:* "runner-cache"

The infix of the physical cache bucket name.

---

##### `expiration`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheProps.property.expiration"></a>

```typescript
public readonly expiration: Duration;
```

- *Type:* [`@aws-cdk/core.Duration`](#@aws-cdk/core.Duration)
- *Default:* 30 days

The number of days after which the created cache objects are deleted from S3.

---

### CacheS3Configuration <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { CacheS3Configuration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const cacheS3Configuration: CacheS3Configuration = { ... }
```

##### `accessKey`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.accessKey"></a>

```typescript
public readonly accessKey: string;
```

- *Type:* `string`

---

##### `bucketLocation`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.bucketLocation"></a>

```typescript
public readonly bucketLocation: string;
```

- *Type:* `string`

The name of the S3 region.

---

##### `bucketName`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.bucketName"></a>

```typescript
public readonly bucketName: string;
```

- *Type:* `string`
- *Default:* "runners-cache"

The name of the storage bucket where cache is stored.

---

##### `secretKey`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.secretKey"></a>

```typescript
public readonly secretKey: string;
```

- *Type:* `string`

---

##### `serverAddress`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.serverAddress"></a>

```typescript
public readonly serverAddress: string;
```

- *Type:* `string`
- *Default:* "s3.amazonaws.com"

The AWS S3 host.

---

### ConfigurationMapperProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ConfigurationMapperProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const configurationMapperProps: ConfigurationMapperProps = { ... }
```

##### `autoscalingConfigurations`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.autoscalingConfigurations"></a>

```typescript
public readonly autoscalingConfigurations: AutoscalingConfiguration[];
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration`](#@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration)[]

---

##### `cacheConfiguration`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.cacheConfiguration"></a>

```typescript
public readonly cacheConfiguration: CacheConfiguration;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration`](#@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration)

---

##### `dockerConfiguration`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.dockerConfiguration"></a>

```typescript
public readonly dockerConfiguration: DockerConfiguration;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration`](#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration)

---

##### `globalConfiguration`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.globalConfiguration"></a>

```typescript
public readonly globalConfiguration: GlobalConfiguration;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration`](#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration)

---

##### `machineConfiguration`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.machineConfiguration"></a>

```typescript
public readonly machineConfiguration: MachineConfiguration;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration`](#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration)

---

##### `runnerConfiguration`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.runnerConfiguration"></a>

```typescript
public readonly runnerConfiguration: RunnerConfiguration;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration`](#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration)

---

### DockerConfiguration <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration"></a>

Configure docker on the runners.

> https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { DockerConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const dockerConfiguration: DockerConfiguration = { ... }
```

##### `allowedImages`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.allowedImages"></a>

```typescript
public readonly allowedImages: string[];
```

- *Type:* `string`[]

Wildcard list of images that can be specified in the .gitlab-ci.yml file. If not present, all images are allowed (equivalent to ["*\/*:*"]). See Restrict Docker images and services.

---

##### `allowedServices`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.allowedServices"></a>

```typescript
public readonly allowedServices: string[];
```

- *Type:* `string`[]

Wildcard list of services that can be specified in the .gitlab-ci.yml file. If not present, all images are allowed (equivalent to [*\/*:*]). See Restrict Docker images and services.

---

##### `cacheDir`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cacheDir"></a>

```typescript
public readonly cacheDir: string;
```

- *Type:* `string`

Directory where Docker caches should be stored.

This path can be absolute or relative to current working directory. See disable_cache for more information.

---

##### `capAdd`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.capAdd"></a>

```typescript
public readonly capAdd: string[];
```

- *Type:* `string`[]
- *Default:* ["CAP_SYS_ADMIN"]

Add additional Linux capabilities to the container.

---

##### `capDrop`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.capDrop"></a>

```typescript
public readonly capDrop: string[];
```

- *Type:* `string`[]

Drop additional Linux capabilities from the container.

---

##### `cpus`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cpus"></a>

```typescript
public readonly cpus: string;
```

- *Type:* `string`

Number of CPUs (available in Docker 1.13 or later. A string.

---

##### `cpusetCpus`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cpusetCpus"></a>

```typescript
public readonly cpusetCpus: string;
```

- *Type:* `string`

The control group’s CpusetCpus.

A string.

---

##### `cpuShares`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cpuShares"></a>

```typescript
public readonly cpuShares: number;
```

- *Type:* `number`

Number of CPU shares used to set relative CPU usage.

Default is 1024.

---

##### `devices`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.devices"></a>

```typescript
public readonly devices: string[];
```

- *Type:* `string`[]

Share additional host devices with the container.

---

##### `disableCache`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.disableCache"></a>

```typescript
public readonly disableCache: boolean;
```

- *Type:* `boolean`
- *Default:* false

The Docker executor has two levels of caching: a global one (like any other executor) and a local cache based on Docker volumes.

This configuration flag acts only on the local one which disables the use of automatically created (not mapped to a host directory) cache volumes. In other words, it only prevents creating a container that holds temporary files of builds, it does not disable the cache if the runner is configured in distributed cache mode.

---

##### `disableEntrypointOverwrite`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.disableEntrypointOverwrite"></a>

```typescript
public readonly disableEntrypointOverwrite: boolean;
```

- *Type:* `boolean`

Disable the image entrypoint overwriting.

---

##### `dns`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.dns"></a>

```typescript
public readonly dns: string[];
```

- *Type:* `string`[]

A list of DNS servers for the container to use.

---

##### `dnsSearch`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.dnsSearch"></a>

```typescript
public readonly dnsSearch: string[];
```

- *Type:* `string`[]

A list of DNS search domains.

---

##### `extraHosts`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.extraHosts"></a>

```typescript
public readonly extraHosts: string[];
```

- *Type:* `string`[]

Hosts that should be defined in container environment.

---

##### `gpus`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.gpus"></a>

```typescript
public readonly gpus: string[];
```

- *Type:* `string`[]

GPU devices for Docker container.

Uses the same format as the docker cli. View details in the Docker documentation.

---

##### `helperImage`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.helperImage"></a>

```typescript
public readonly helperImage: string;
```

- *Type:* `string`

(Advanced) The default helper image used to clone repositories and upload artifacts.

---

##### `helperImageFlavor`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.helperImageFlavor"></a>

```typescript
public readonly helperImageFlavor: string;
```

- *Type:* `string`

Sets the helper image flavor (alpine, alpine3.12, alpine3.13, alpine3.14 or ubuntu). Defaults to alpine. The alpine flavor uses the same version as alpine3.12.

---

##### `host`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.host"></a>

```typescript
public readonly host: string;
```

- *Type:* `string`

Custom Docker endpoint.

Default is DOCKER_HOST environment or unix:///var/run/docker.sock.

---

##### `hostname`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.hostname"></a>

```typescript
public readonly hostname: string;
```

- *Type:* `string`

Custom hostname for the Docker container.

---

##### `image`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* `string`

The image to run jobs with.

---

##### `links`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.links"></a>

```typescript
public readonly links: string[];
```

- *Type:* `string`[]

Containers that should be linked with container that runs the job.

---

##### `memory`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.memory"></a>

```typescript
public readonly memory: string;
```

- *Type:* `string`

The memory limit.

A string.

---

##### `memoryReservation`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.memoryReservation"></a>

```typescript
public readonly memoryReservation: string;
```

- *Type:* `string`

The memory soft limit.

A string.

---

##### `memorySwap`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.memorySwap"></a>

```typescript
public readonly memorySwap: string;
```

- *Type:* `string`

The total memory limit.

A string.

---

##### `networkMode`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.networkMode"></a>

```typescript
public readonly networkMode: string;
```

- *Type:* `string`

Add container to a custom network.

---

##### `oomKillDisable`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.oomKillDisable"></a>

```typescript
public readonly oomKillDisable: boolean;
```

- *Type:* `boolean`

If an out-of-memory (OOM) error occurs, do not kill processes in a container.

---

##### `oomScoreAdjust`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.oomScoreAdjust"></a>

```typescript
public readonly oomScoreAdjust: string;
```

- *Type:* `string`

OOM score adjustment.

Positive means kill earlier.

---

##### `privileged`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.privileged"></a>

```typescript
public readonly privileged: boolean;
```

- *Type:* `boolean`
- *Default:* true

Make the container run in privileged mode.

Insecure.

---

##### `pullPolicy`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.pullPolicy"></a>

```typescript
public readonly pullPolicy: string;
```

- *Type:* `string`

The image pull policy: never, if-not-present or always (default).

View details in the pull policies documentation. You can also add multiple pull policies.

---

##### `runtime`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.runtime"></a>

```typescript
public readonly runtime: string;
```

- *Type:* `string`

The runtime for the Docker container.

---

##### `securityOpt`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.securityOpt"></a>

```typescript
public readonly securityOpt: string;
```

- *Type:* `string`

Security options (–security-opt in docker run).

Takes a list of : separated key/values.

---

##### `shmSize`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.shmSize"></a>

```typescript
public readonly shmSize: number;
```

- *Type:* `number`
- *Default:* 0

Shared memory size for images (in bytes).

---

##### `sysctls`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.sysctls"></a>

```typescript
public readonly sysctls: string;
```

- *Type:* `string`

The sysctl options.

---

##### `tlsCertPath`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.tlsCertPath"></a>

```typescript
public readonly tlsCertPath: string;
```

- *Type:* `string`

A directory where ca.pem, cert.pem or key.pem are stored and used to make a secure TLS connection to Docker. Useful in boot2docker.

---

##### `tlsVerify`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.tlsVerify"></a>

```typescript
public readonly tlsVerify: boolean;
```

- *Type:* `boolean`
- *Default:* false

Enable or disable TLS verification of connections to Docker daemon.

Disabled by default.

---

##### `usernsMode`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.usernsMode"></a>

```typescript
public readonly usernsMode: string;
```

- *Type:* `string`

The user namespace mode for the container and Docker services when user namespace remapping option is enabled.

Available in Docker 1.10 or later.

---

##### `volumeDriver`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.volumeDriver"></a>

```typescript
public readonly volumeDriver: string;
```

- *Type:* `string`

The volume driver to use for the container.

---

##### `volumes`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.volumes"></a>

```typescript
public readonly volumes: string[];
```

- *Type:* `string`[]

Additional volumes that should be mounted.

Same syntax as the Docker -v flag.

---

##### `volumesFrom`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.volumesFrom"></a>

```typescript
public readonly volumesFrom: string[];
```

- *Type:* `string`[]

A list of volumes to inherit from another container in the form <container name>[:<ro|rw>].

Access level defaults to read-write, but can be manually set to ro (read-only) or rw (read-write).

---

##### `waitForServicesTimeout`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.waitForServicesTimeout"></a>

```typescript
public readonly waitForServicesTimeout: number;
```

- *Type:* `number`
- *Default:* 300

How long to wait for Docker services.

Set to 0 to disable. Default is 30.

---

### GitlabRunnerAutoscalingCacheProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps"></a>

The distributed GitLab runner S3 cache.

Either pass an existing bucket or override default options.

> {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section}

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingCacheProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingCacheProps: GitlabRunnerAutoscalingCacheProps = { ... }
```

##### `bucket`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* [`@aws-cdk/aws-s3.IBucket`](#@aws-cdk/aws-s3.IBucket)

An existing S3 bucket used as runner's cache.

---

##### `options`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps.property.options"></a>

```typescript
public readonly options: CacheProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.CacheProps`](#@pepperize/cdk-autoscaling-gitlab-runner.CacheProps)

If no existing S3 bucket is provided, a S3 bucket will be created.

---

### GitlabRunnerAutoscalingManager <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingManager } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingManager: GitlabRunnerAutoscalingManager = { ... }
```

##### `autoScalingGroup`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.autoScalingGroup"></a>

```typescript
public readonly autoScalingGroup: IAutoScalingGroup;
```

- *Type:* [`@aws-cdk/aws-autoscaling.IAutoScalingGroup`](#@aws-cdk/aws-autoscaling.IAutoScalingGroup)

---

##### `instanceType`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* [`@aws-cdk/aws-ec2.InstanceType`](#@aws-cdk/aws-ec2.InstanceType)

---

##### `machineImage`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* [`@aws-cdk/aws-ec2.IMachineImage`](#@aws-cdk/aws-ec2.IMachineImage)

---

##### `role`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* [`@aws-cdk/aws-iam.IRole`](#@aws-cdk/aws-iam.IRole)

---

##### `securityGroup`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.securityGroup"></a>

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* [`@aws-cdk/aws-ec2.ISecurityGroup`](#@aws-cdk/aws-ec2.ISecurityGroup)

---

### GitlabRunnerAutoscalingManagerProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingManagerProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingManagerProps: GitlabRunnerAutoscalingManagerProps = { ... }
```

##### `instanceType`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* [`@aws-cdk/aws-ec2.InstanceType`](#@aws-cdk/aws-ec2.InstanceType)
- *Default:* InstanceType.of(InstanceClass.T3, InstanceSize.NANO)

Instance type for manager EC2 instance.

It's a combination of a class and size.

---

##### `keyPairName`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.keyPairName"></a>

```typescript
public readonly keyPairName: string;
```

- *Type:* `string`

A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance.

You won't be able to ssh into an instance without the Key Pair.

---

##### `machineImage`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* [`@aws-cdk/aws-ec2.IMachineImage`](#@aws-cdk/aws-ec2.IMachineImage)

An Amazon Machine Image ID for the Manager EC2 instance.

If empty the latest Amazon 2 Image will be looked up.

---

### GitlabRunnerAutoscalingProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps"></a>

Properties of the Gitlab Runner.

You have to provide at least the GitLab's Runner's authentication token.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingProps: GitlabRunnerAutoscalingProps = { ... }
```

##### `checkInterval`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.checkInterval"></a>

```typescript
public readonly checkInterval: number;
```

- *Type:* `number`
- *Default:* 0

The check_interval option defines how often the runner should check GitLab for new jobs| in seconds.

---

##### `concurrent`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.concurrent"></a>

```typescript
public readonly concurrent: number;
```

- *Type:* `number`
- *Default:* 10

The limit of the jobs that can be run concurrently across all runners (concurrent).

---

##### `logFormat`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.logFormat"></a>

```typescript
public readonly logFormat: string;
```

- *Type:* `string`
- *Default:* "runner"

The log format.

---

##### `logLevel`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.logLevel"></a>

```typescript
public readonly logLevel: string;
```

- *Type:* `string`
- *Default:* "info"

The log_level.

---

##### `gitlabToken`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.gitlabToken"></a>

```typescript
public readonly gitlabToken: string;
```

- *Type:* `string`

The GitLab Runner’s authentication token, which is obtained during runner registration.

> {@link https://docs.gitlab.com/ee/api/runners.html#registration-and-authentication-tokens}

---

##### `cache`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.cache"></a>

```typescript
public readonly cache: GitlabRunnerAutoscalingCacheProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps`](#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps)

---

##### `gitlabUrl`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.gitlabUrl"></a>

```typescript
public readonly gitlabUrl: string;
```

- *Type:* `string`
- *Default:* "https://gitlab.com"

GitLab instance URL.

---

##### `manager`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.manager"></a>

```typescript
public readonly manager: GitlabRunnerAutoscalingManagerProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps`](#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps)

The manager EC2 instance configuration.

If not set, the defaults will be used.

> [GitlabRunnerAutoscalingManagerProps](GitlabRunnerAutoscalingManagerProps)

---

##### `network`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.network"></a>

```typescript
public readonly network: NetworkProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps`](#@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps)

The network configuration for the Runner.

If not set, the defaults will be used.

> [NetworkProps](NetworkProps)

---

##### `runners`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.runners"></a>

```typescript
public readonly runners: GitlabRunnerAutoscalingRunnerProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps`](#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps)

---

### GitlabRunnerAutoscalingRunnerProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps"></a>

The runner EC2 instances configuration.

If not set, the defaults will be used.

> [GitlabRunnerAutoscalingProps](GitlabRunnerAutoscalingProps)

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingRunnerProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingRunnerProps: GitlabRunnerAutoscalingRunnerProps = { ... }
```

##### `autoscaling`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.autoscaling"></a>

```typescript
public readonly autoscaling: AutoscalingConfiguration[];
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration`](#@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration)[]

---

##### `docker`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.docker"></a>

```typescript
public readonly docker: DockerConfiguration;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration`](#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration)

Optional docker configuration.

---

##### `environment`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.environment"></a>

```typescript
public readonly environment: string[];
```

- *Type:* `string`[]
- *Default:* ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"]

Append or overwrite environment variables.

---

##### `instanceType`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* [`@aws-cdk/aws-ec2.InstanceType`](#@aws-cdk/aws-ec2.InstanceType)
- *Default:* InstanceType.of(InstanceClass.T3, InstanceSize.MICRO)

Instance type for runner EC2 instances.

It's a combination of a class and size.

---

##### `limit`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.limit"></a>

```typescript
public readonly limit: number;
```

- *Type:* `number`
- *Default:* 10

Limit how many jobs can be handled concurrently by this registered runner.

0 (default) means do not limit.

---

##### `machine`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.machine"></a>

```typescript
public readonly machine: MachineConfiguration;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration`](#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration)

Optional docker machine configuration.

---

##### `machineImage`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* [`@aws-cdk/aws-ec2.IMachineImage`](#@aws-cdk/aws-ec2.IMachineImage)

An Amazon Machine Image ID for the Runners EC2 instances.

If empty the latest Ubuntu 20.04 focal will be looked up.

> https://cloud-images.ubuntu.com/locator/ec2/

---

##### `outputLimit`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.outputLimit"></a>

```typescript
public readonly outputLimit: number;
```

- *Type:* `number`
- *Default:* 52428800 (50GB)

Maximum build log size in kilobytes.

Default is 4096 (4MB).

---

##### `role`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* [`@aws-cdk/aws-iam.IRole`](#@aws-cdk/aws-iam.IRole)

Optionally pass an IAM role, that get's assigned to the EC2 runner instances.

---

### GitlabRunnerAutoscalingRunners <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunners"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingRunners } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingRunners: GitlabRunnerAutoscalingRunners = { ... }
```

##### `instanceProfile`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunners.property.instanceProfile"></a>

```typescript
public readonly instanceProfile: CfnInstanceProfile;
```

- *Type:* [`@aws-cdk/aws-iam.CfnInstanceProfile`](#@aws-cdk/aws-iam.CfnInstanceProfile)

---

##### `instanceType`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunners.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* [`@aws-cdk/aws-ec2.InstanceType`](#@aws-cdk/aws-ec2.InstanceType)

---

##### `machineImage`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunners.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* [`@aws-cdk/aws-ec2.IMachineImage`](#@aws-cdk/aws-ec2.IMachineImage)

---

##### `role`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunners.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* [`@aws-cdk/aws-iam.IRole`](#@aws-cdk/aws-iam.IRole)

---

##### `securityGroup`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunners.property.securityGroup"></a>

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* [`@aws-cdk/aws-ec2.ISecurityGroup`](#@aws-cdk/aws-ec2.ISecurityGroup)

---

##### `securityGroupName`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunners.property.securityGroupName"></a>

```typescript
public readonly securityGroupName: string;
```

- *Type:* `string`

---

### GlobalConfiguration <a name="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration"></a>

You can change the behavior of GitLab Runner and of individual registered runners.

This imitates the structure of Gitlab Runner advanced configuration that originally is set with config.toml file.

> {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html}

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GlobalConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const globalConfiguration: GlobalConfiguration = { ... }
```

##### `checkInterval`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.checkInterval"></a>

```typescript
public readonly checkInterval: number;
```

- *Type:* `number`
- *Default:* 0

The check_interval option defines how often the runner should check GitLab for new jobs| in seconds.

---

##### `concurrent`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.concurrent"></a>

```typescript
public readonly concurrent: number;
```

- *Type:* `number`
- *Default:* 10

The limit of the jobs that can be run concurrently across all runners (concurrent).

---

##### `logFormat`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.logFormat"></a>

```typescript
public readonly logFormat: string;
```

- *Type:* `string`
- *Default:* "runner"

The log format.

---

##### `logLevel`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.logLevel"></a>

```typescript
public readonly logLevel: string;
```

- *Type:* `string`
- *Default:* "info"

The log_level.

---

### MachineConfiguration <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { MachineConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const machineConfiguration: MachineConfiguration = { ... }
```

##### `idleCount`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.idleCount"></a>

```typescript
public readonly idleCount: number;
```

- *Type:* `number`
- *Default:* 0

---

##### `idleTime`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.idleTime"></a>

```typescript
public readonly idleTime: number;
```

- *Type:* `number`
- *Default:* 300

---

##### `machineDriver`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.machineDriver"></a>

```typescript
public readonly machineDriver: string;
```

- *Type:* `string`
- *Default:* "amazonec2"

---

##### `machineName`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.machineName"></a>

```typescript
public readonly machineName: string;
```

- *Type:* `string`
- *Default:* "gitlab-runner"

---

##### `machineOptions`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.machineOptions"></a>

```typescript
public readonly machineOptions: MachineOptions;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions`](#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions)

---

##### `maxBuilds`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.maxBuilds"></a>

```typescript
public readonly maxBuilds: number;
```

- *Type:* `number`
- *Default:* 20

---

### MachineOptions <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { MachineOptions } from '@pepperize/cdk-autoscaling-gitlab-runner'

const machineOptions: MachineOptions = { ... }
```

##### `ami`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.ami"></a>

```typescript
public readonly ami: string;
```

- *Type:* `string`

---

##### `blockDurationMinutes`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.blockDurationMinutes"></a>

```typescript
public readonly blockDurationMinutes: number;
```

- *Type:* `number`

The amazonec2-block-duration-minutes parameter.

AWS spot instance duration in minutes (60, 120, 180, 240, 300, or 360).

> {@link https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances}

---

##### `iamInstanceProfile`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.iamInstanceProfile"></a>

```typescript
public readonly iamInstanceProfile: string;
```

- *Type:* `string`

---

##### `instanceType`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.instanceType"></a>

```typescript
public readonly instanceType: string;
```

- *Type:* `string`

---

##### `region`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* `string`

---

##### `requestSpotInstance`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.requestSpotInstance"></a>

```typescript
public readonly requestSpotInstance: boolean;
```

- *Type:* `boolean`
- *Default:* true

The amazonec2-request-spot-instance parameter.

Whether or not to request spot instances.

> {@link https://aws.amazon.com/ec2/spot/}

---

##### `securityGroup`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.securityGroup"></a>

```typescript
public readonly securityGroup: string;
```

- *Type:* `string`

The SecurityGroup's GroupName, not the GroupId.

---

##### `spotPrice`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.spotPrice"></a>

```typescript
public readonly spotPrice: number;
```

- *Type:* `number`
- *Default:* 0.03

The amazonec2-spot-price parameter.

The bidding price for spot instances.

> {@link https://aws.amazon.com/ec2/spot/pricing/}

---

##### `subnetId`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.subnetId"></a>

```typescript
public readonly subnetId: string;
```

- *Type:* `string`

---

##### `usePrivateAddress`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.usePrivateAddress"></a>

```typescript
public readonly usePrivateAddress: boolean;
```

- *Type:* `boolean`

---

##### `vpcId`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.vpcId"></a>

```typescript
public readonly vpcId: string;
```

- *Type:* `string`

---

##### `zone`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.zone"></a>

```typescript
public readonly zone: string;
```

- *Type:* `string`

Extract the availabilityZone last character for the needs of gitlab configuration.

> {@link https://docs.gitlab.com/runners/configuration/runners_autoscale_aws/#the-runnerssmachine-section}

---

### NetworkProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { NetworkProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const networkProps: NetworkProps = { ... }
```

##### `subnetSelection`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps.property.subnetSelection"></a>

```typescript
public readonly subnetSelection: SubnetSelection;
```

- *Type:* [`@aws-cdk/aws-ec2.SubnetSelection`](#@aws-cdk/aws-ec2.SubnetSelection)

The GitLab Runner's subnets.

It should be either public or private. If more then subnet is selected, then the first found (private) subnet will be used.

> {@link https://docs.aws.amazon.com/cdk/api/latest/docs/

---

##### `vpc`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* [`@aws-cdk/aws-ec2.IVpc`](#@aws-cdk/aws-ec2.IVpc)

If no existing VPC is provided, a default Vpc will be created.

---

### RunnerConfiguration <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { RunnerConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const runnerConfiguration: RunnerConfiguration = { ... }
```

##### `buildsDir`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.buildsDir"></a>

```typescript
public readonly buildsDir: string;
```

- *Type:* `string`

Absolute path to a directory where builds are stored in the context of the selected executor.

For example, locally, Docker, or SSH.

---

##### `cacheDir`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.cacheDir"></a>

```typescript
public readonly cacheDir: string;
```

- *Type:* `string`

Absolute path to a directory where build caches are stored in context of selected executor.

For example, locally, Docker, or SSH. If the docker executor is used, this directory needs to be included in its volumes parameter.

---

##### `cloneUrl`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.cloneUrl"></a>

```typescript
public readonly cloneUrl: string;
```

- *Type:* `string`

Overwrite the URL for the GitLab instance.

Used only if the runner can’t connect to the GitLab URL.

---

##### `debugTraceDisabled`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.debugTraceDisabled"></a>

```typescript
public readonly debugTraceDisabled: boolean;
```

- *Type:* `boolean`

Disables the CI_DEBUG_TRACE feature.

When set to true, then debug log (trace) remains disabled, even if CI_DEBUG_TRACE is set to true by the user.

---

##### `environment`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.environment"></a>

```typescript
public readonly environment: string[];
```

- *Type:* `string`[]
- *Default:* ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"]

Append or overwrite environment variables.

---

##### `executor`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.executor"></a>

```typescript
public readonly executor: string;
```

- *Type:* `string`
- *Default:* "docker+machine"

Select how a project should be built.

---

##### `limit`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.limit"></a>

```typescript
public readonly limit: number;
```

- *Type:* `number`
- *Default:* 10

Limit how many jobs can be handled concurrently by this registered runner.

0 (default) means do not limit.

---

##### `name`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`
- *Default:* "gitlab-runner"

The runner’s description.

Informational only.

---

##### `outputLimit`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.outputLimit"></a>

```typescript
public readonly outputLimit: number;
```

- *Type:* `number`
- *Default:* 52428800 (50GB)

Maximum build log size in kilobytes.

Default is 4096 (4MB).

---

##### `postBuildScript`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.postBuildScript"></a>

```typescript
public readonly postBuildScript: string;
```

- *Type:* `string`

Commands to be executed on the runner just after executing the build, but before executing after_script.

To insert multiple commands, use a (triple-quoted) multi-line string or \n character.

---

##### `preBuildScript`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.preBuildScript"></a>

```typescript
public readonly preBuildScript: string;
```

- *Type:* `string`

Commands to be executed on the runner after cloning the Git repository, but before executing the build.

To insert multiple commands, use a (triple-quoted) multi-line string or \n character.

---

##### `preCloneScript`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.preCloneScript"></a>

```typescript
public readonly preCloneScript: string;
```

- *Type:* `string`

Commands to be executed on the runner before cloning the Git repository.

Use it to adjust the Git client configuration first, for example. To insert multiple commands, use a (triple-quoted) multi-line string or \n character.

---

##### `referees`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.referees"></a>

```typescript
public readonly referees: string;
```

- *Type:* `string`

Extra job monitoring workers that pass their results as job artifacts to GitLab.

---

##### `requestConcurrency`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.requestConcurrency"></a>

```typescript
public readonly requestConcurrency: number;
```

- *Type:* `number`

Limit number of concurrent requests for new jobs from GitLab.

Default is 1.

---

##### `shell`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.shell"></a>

```typescript
public readonly shell: string;
```

- *Type:* `string`

Name of shell to generate the script.

Default value is platform dependent.

---

##### `tlsCaFile`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.tlsCaFile"></a>

```typescript
public readonly tlsCaFile: string;
```

- *Type:* `string`

When using HTTPS, file that contains the certificates to verify the peer.

See Self-signed certificates or custom Certification Authorities documentation.

---

##### `tlsCertFile`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.tlsCertFile"></a>

```typescript
public readonly tlsCertFile: string;
```

- *Type:* `string`

When using HTTPS, file that contains the certificate to authenticate with the peer.

---

##### `tlsKeyFile`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.tlsKeyFile"></a>

```typescript
public readonly tlsKeyFile: string;
```

- *Type:* `string`

When using HTTPS, file that contains the private key to authenticate with the peer.

---

##### `token`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.token"></a>

```typescript
public readonly token: string;
```

- *Type:* `string`

The runner’s authentication token, which is obtained during runner registration.

Not the same as the registration token.

---

##### `url`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.url"></a>

```typescript
public readonly url: string;
```

- *Type:* `string`
- *Default:* "https://gitlab.com"

GitLab instance URL.

---

## Classes <a name="Classes"></a>

### ConfigurationMapper <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper"></a>

#### Methods <a name="Methods"></a>

##### `toToml` <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.toToml"></a>

```typescript
public toToml()
```

#### Static Functions <a name="Static Functions"></a>

##### `fromProps` <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.fromProps"></a>

```typescript
import { ConfigurationMapper } from '@pepperize/cdk-autoscaling-gitlab-runner'

ConfigurationMapper.fromProps(props: ConfigurationMapperProps)
```

###### `props`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.parameter.props"></a>

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps`](#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps)

---

##### `withDefaults` <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.withDefaults"></a>

```typescript
import { ConfigurationMapper } from '@pepperize/cdk-autoscaling-gitlab-runner'

ConfigurationMapper.withDefaults(props: ConfigurationMapperProps)
```

###### `props`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.parameter.props"></a>

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps`](#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps)

---

#### Properties <a name="Properties"></a>

##### `props`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.property.props"></a>

```typescript
public readonly props: ConfigurationMapperProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps`](#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps)

---



