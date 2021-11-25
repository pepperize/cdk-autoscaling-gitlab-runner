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

### ConfigurationMap <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMap"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ConfigurationMap } from '@pepperize/cdk-autoscaling-gitlab-runner'

const configurationMap: ConfigurationMap = { ... }
```

### ConfigurationProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ConfigurationProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const configurationProps: ConfigurationProps = { ... }
```

##### `runners`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationProps.property.runners"></a>

```typescript
public readonly runners: RunnerConfigurationProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps`](#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps)

---

##### `scope`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationProps.property.scope"></a>

```typescript
public readonly scope: Stack;
```

- *Type:* [`@aws-cdk/core.Stack`](#@aws-cdk/core.Stack)

---

##### `checkInterval`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationProps.property.checkInterval"></a>

```typescript
public readonly checkInterval: number;
```

- *Type:* `number`
- *Default:* 0

The check_interval option defines how often the runner should check GitLab for new jobs| in seconds.

---

##### `concurrent`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationProps.property.concurrent"></a>

```typescript
public readonly concurrent: number;
```

- *Type:* `number`
- *Default:* 10

The limit of the jobs that can be run concurrently across all runners (concurrent).

---

##### `logFormat`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationProps.property.logFormat"></a>

```typescript
public readonly logFormat: string;
```

- *Type:* `string`

The log format.

---

##### `logLevel`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationProps.property.logLevel"></a>

```typescript
public readonly logLevel: string;
```

- *Type:* `string`

The log_level.

---

### GitlabRunnerAutoscalingCacheProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps"></a>

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

The distributed GitLab runner S3 cache.

Either pass an existing bucket or override default options.

> {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section}

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

---

##### `network`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.network"></a>

```typescript
public readonly network: NetworkProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps`](#@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps)

---

##### `runners`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.runners"></a>

```typescript
public readonly runners: GitlabRunnerAutoscalingRunnerProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps`](#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps)

---

### GitlabRunnerAutoscalingRunnerProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingRunnerProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingRunnerProps: GitlabRunnerAutoscalingRunnerProps = { ... }
```

##### `instanceType`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingRunnerProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* [`@aws-cdk/aws-ec2.InstanceType`](#@aws-cdk/aws-ec2.InstanceType)
- *Default:* InstanceType.of(InstanceClass.T3, InstanceSize.MICRO)

Instance type for runner EC2 instances.

It's a combination of a class and size.

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

### MachineConfigurationProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfigurationProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { MachineConfigurationProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const machineConfigurationProps: MachineConfigurationProps = { ... }
```

##### `machineOptions`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfigurationProps.property.machineOptions"></a>

```typescript
public readonly machineOptions: MachineOptionsConfigurationProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.MachineOptionsConfigurationProps`](#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptionsConfigurationProps)

---

### MachineOptionsConfigurationProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptionsConfigurationProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { MachineOptionsConfigurationProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const machineOptionsConfigurationProps: MachineOptionsConfigurationProps = { ... }
```

##### `instanceProfile`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptionsConfigurationProps.property.instanceProfile"></a>

```typescript
public readonly instanceProfile: CfnInstanceProfile;
```

- *Type:* [`@aws-cdk/aws-iam.CfnInstanceProfile`](#@aws-cdk/aws-iam.CfnInstanceProfile)

---

##### `instanceType`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptionsConfigurationProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* [`@aws-cdk/aws-ec2.InstanceType`](#@aws-cdk/aws-ec2.InstanceType)

---

##### `machineImage`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptionsConfigurationProps.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* [`@aws-cdk/aws-ec2.IMachineImage`](#@aws-cdk/aws-ec2.IMachineImage)

---

##### `securityGroupName`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptionsConfigurationProps.property.securityGroupName"></a>

```typescript
public readonly securityGroupName: string;
```

- *Type:* `string`

---

##### `spot`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptionsConfigurationProps.property.spot"></a>

```typescript
public readonly spot: SpotConfigurationProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.SpotConfigurationProps`](#@pepperize/cdk-autoscaling-gitlab-runner.SpotConfigurationProps)

---

##### `vpc`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptionsConfigurationProps.property.vpc"></a>

```typescript
public readonly vpc: VpcConfigurationProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.VpcConfigurationProps`](#@pepperize/cdk-autoscaling-gitlab-runner.VpcConfigurationProps)

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

### RunnerConfigurationProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { RunnerConfigurationProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const runnerConfigurationProps: RunnerConfigurationProps = { ... }
```

##### `cache`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps.property.cache"></a>

```typescript
public readonly cache: IBucket;
```

- *Type:* [`@aws-cdk/aws-s3.IBucket`](#@aws-cdk/aws-s3.IBucket)

---

##### `gitlabToken`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps.property.gitlabToken"></a>

```typescript
public readonly gitlabToken: string;
```

- *Type:* `string`

The GitLab Runner's auth token.

---

##### `machine`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps.property.machine"></a>

```typescript
public readonly machine: MachineConfigurationProps;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.MachineConfigurationProps`](#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfigurationProps)

---

##### `environment`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps.property.environment"></a>

```typescript
public readonly environment: string[];
```

- *Type:* `string`[]
- *Default:* ["DOCKER_DRIVER=overlay2","DOCKER_TLS_CERTDIR=/certs"]

Append or overwrite environment variables.

> {@link https://docs.gitlab.com/runners/configuration/advanced-configuration.html#the-runnerss-section}

---

##### `executor`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps.property.executor"></a>

```typescript
public readonly executor: string;
```

- *Type:* `string`
- *Default:* "docker+machine" Use auto-scaled Docker machines.

The following executors are available.

> {@link https://docs.gitlab.com/runners/configuration/advanced-configuration.html#the-executors}

---

##### `gitlabUrl`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps.property.gitlabUrl"></a>

```typescript
public readonly gitlabUrl: string;
```

- *Type:* `string`
- *Default:* "https://gitlab.com"

GitLab instance URL.

---

##### `limit`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps.property.limit"></a>

```typescript
public readonly limit: number;
```

- *Type:* `number`
- *Default:* 10

Limit how many jobs can be handled concurrently by this registered runners.

---

##### `name`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`
- *Default:* "gitlab-runners"

The runners’s name.

---

##### `outputLimit`<sup>Optional</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfigurationProps.property.outputLimit"></a>

```typescript
public readonly outputLimit: number;
```

- *Type:* `number`
- *Default:* 52428800 Default is 50 GB.

Maximum build log size in kilobytes.

---

### SpotConfigurationProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.SpotConfigurationProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { SpotConfigurationProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const spotConfigurationProps: SpotConfigurationProps = { ... }
```

##### `requestSpotInstance`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.SpotConfigurationProps.property.requestSpotInstance"></a>

```typescript
public readonly requestSpotInstance: boolean;
```

- *Type:* `boolean`

---

##### `spotPrice`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.SpotConfigurationProps.property.spotPrice"></a>

```typescript
public readonly spotPrice: number;
```

- *Type:* `number`

---

### VpcConfigurationProps <a name="@pepperize/cdk-autoscaling-gitlab-runner.VpcConfigurationProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { VpcConfigurationProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const vpcConfigurationProps: VpcConfigurationProps = { ... }
```

##### `availabilityZone`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.VpcConfigurationProps.property.availabilityZone"></a>

```typescript
public readonly availabilityZone: string;
```

- *Type:* `string`

The availability zone of the vpc contains the region prefixed.

The GitLab Runner configuration accepts only the availability zone symbol i.e. a.

---

##### `subnetId`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.VpcConfigurationProps.property.subnetId"></a>

```typescript
public readonly subnetId: string;
```

- *Type:* `string`

---

##### `vpcId`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.VpcConfigurationProps.property.vpcId"></a>

```typescript
public readonly vpcId: string;
```

- *Type:* `string`

---

## Classes <a name="Classes"></a>

### Configuration <a name="@pepperize/cdk-autoscaling-gitlab-runner.Configuration"></a>

The GitLab Runner configuration to generate the [config.toml]{@link https://docs.gitlab.com/runners/configuration/advanced-configuration.html}.

#### Initializers <a name="@pepperize/cdk-autoscaling-gitlab-runner.Configuration.Initializer"></a>

```typescript
import { Configuration } from '@pepperize/cdk-autoscaling-gitlab-runner'

new Configuration(globalConfiguration: ConfigurationMap)
```

##### `globalConfiguration`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Configuration.parameter.globalConfiguration"></a>

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMap`](#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMap)

---

#### Methods <a name="Methods"></a>

##### `toToml` <a name="@pepperize/cdk-autoscaling-gitlab-runner.Configuration.toToml"></a>

```typescript
public toToml()
```

#### Static Functions <a name="Static Functions"></a>

##### `fromProps` <a name="@pepperize/cdk-autoscaling-gitlab-runner.Configuration.fromProps"></a>

```typescript
import { Configuration } from '@pepperize/cdk-autoscaling-gitlab-runner'

Configuration.fromProps(props: ConfigurationProps)
```

###### `props`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Configuration.parameter.props"></a>

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationProps`](#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationProps)

---

#### Properties <a name="Properties"></a>

##### `globalConfiguration`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.Configuration.property.globalConfiguration"></a>

```typescript
public readonly globalConfiguration: ConfigurationMap;
```

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMap`](#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMap)

---


### MachineOptions <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions"></a>

#### Initializers <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.Initializer"></a>

```typescript
import { MachineOptions } from '@pepperize/cdk-autoscaling-gitlab-runner'

new MachineOptions(props: ConfigurationMap)
```

##### `props`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.parameter.props"></a>

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMap`](#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMap)

---

#### Methods <a name="Methods"></a>

##### `toArray` <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.toArray"></a>

```typescript
public toArray()
```

#### Static Functions <a name="Static Functions"></a>

##### `fromProps` <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.fromProps"></a>

```typescript
import { MachineOptions } from '@pepperize/cdk-autoscaling-gitlab-runner'

MachineOptions.fromProps(props: ConfigurationMap)
```

###### `props`<sup>Required</sup> <a name="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.parameter.props"></a>

- *Type:* [`@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMap`](#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMap)

---




