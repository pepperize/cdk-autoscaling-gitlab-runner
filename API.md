# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Cache <a name="Cache" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache"></a>

A GitLab Runner cache consisting of an Amazon S3 bucket.

The bucket is encrypted with a KMS managed master key, it has public access blocked and will be cleared and deleted on CFN stack deletion.

#### Initializers <a name="Initializers" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache.Initializer"></a>

```typescript
import { Cache } from '@pepperize/cdk-autoscaling-gitlab-runner'

new Cache(scope: Construct, id: string, props?: CacheProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Cache.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Cache.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Cache.Initializer.parameter.props">props</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheProps">CacheProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache.Initializer.parameter.props"></a>

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheProps">CacheProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Cache.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Cache.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache.isConstruct"></a>

```typescript
import { Cache } from '@pepperize/cdk-autoscaling-gitlab-runner'

Cache.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Cache.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Cache.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@pepperize/cdk-autoscaling-gitlab-runner.Cache.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---


### GitlabRunnerAutoscaling <a name="GitlabRunnerAutoscaling" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling"></a>

The Gitlab Runner autoscaling on EC2 by Docker Machine.

*Example*

```typescript
<caption>Provisioning a basic Runner</caption>
const app = new cdk.App();
const stack = new cdk.Stack(app, "RunnerStack", {
env: {
account: "000000000000",
region: "us-east-1",
}
});

const token = new StringParameter(stack, "imported-token", {
parameterName: "/gitlab-runner/token1",
stringValue: gitlabToken,
type: ParameterType.SECURE_STRING,
tier: ParameterTier.STANDARD,
});

new GitlabRunnerAutoscaling(stack, "GitlabRunner", {
runners: [{
token: "xxxxxxxxxxxxxxxxxxxx"
}],
});
```


#### Initializers <a name="Initializers" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.Initializer"></a>

```typescript
import { GitlabRunnerAutoscaling } from '@pepperize/cdk-autoscaling-gitlab-runner'

new GitlabRunnerAutoscaling(scope: Stack, id: string, props: GitlabRunnerAutoscalingProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.Initializer.parameter.scope">scope</a></code> | <code>aws-cdk-lib.Stack</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.Initializer.parameter.props">props</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps">GitlabRunnerAutoscalingProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.Initializer.parameter.scope"></a>

- *Type:* aws-cdk-lib.Stack

---

##### `id`<sup>Required</sup> <a name="id" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.Initializer.parameter.props"></a>

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps">GitlabRunnerAutoscalingProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.isConstruct"></a>

```typescript
import { GitlabRunnerAutoscaling } from '@pepperize/cdk-autoscaling-gitlab-runner'

GitlabRunnerAutoscaling.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.cacheBucket">cacheBucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.manager">manager</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager">GitlabRunnerAutoscalingManager</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.network">network</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network">Network</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.runners">runners</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner">GitlabRunnerAutoscalingJobRunner</a>[]</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.checkInterval">checkInterval</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.concurrent">concurrent</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.logFormat">logFormat</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.logLevel">logLevel</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `cacheBucket`<sup>Required</sup> <a name="cacheBucket" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.cacheBucket"></a>

```typescript
public readonly cacheBucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `manager`<sup>Required</sup> <a name="manager" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.manager"></a>

```typescript
public readonly manager: GitlabRunnerAutoscalingManager;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager">GitlabRunnerAutoscalingManager</a>

---

##### `network`<sup>Required</sup> <a name="network" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.network"></a>

```typescript
public readonly network: Network;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network">Network</a>

---

##### `runners`<sup>Required</sup> <a name="runners" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.runners"></a>

```typescript
public readonly runners: GitlabRunnerAutoscalingJobRunner[];
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner">GitlabRunnerAutoscalingJobRunner</a>[]

---

##### `checkInterval`<sup>Optional</sup> <a name="checkInterval" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.checkInterval"></a>

```typescript
public readonly checkInterval: number;
```

- *Type:* number

---

##### `concurrent`<sup>Optional</sup> <a name="concurrent" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.concurrent"></a>

```typescript
public readonly concurrent: number;
```

- *Type:* number

---

##### `logFormat`<sup>Optional</sup> <a name="logFormat" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.logFormat"></a>

```typescript
public readonly logFormat: string;
```

- *Type:* string

---

##### `logLevel`<sup>Optional</sup> <a name="logLevel" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscaling.property.logLevel"></a>

```typescript
public readonly logLevel: string;
```

- *Type:* string

---


### GitlabRunnerAutoscalingJobRunner <a name="GitlabRunnerAutoscalingJobRunner" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner"></a>

#### Initializers <a name="Initializers" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingJobRunner } from '@pepperize/cdk-autoscaling-gitlab-runner'

new GitlabRunnerAutoscalingJobRunner(scope: Construct, id: string, props: GitlabRunnerAutoscalingJobRunnerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.Initializer.parameter.props">props</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps">GitlabRunnerAutoscalingJobRunnerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.Initializer.parameter.props"></a>

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps">GitlabRunnerAutoscalingJobRunnerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.isConstruct"></a>

```typescript
import { GitlabRunnerAutoscalingJobRunner } from '@pepperize/cdk-autoscaling-gitlab-runner'

GitlabRunnerAutoscalingJobRunner.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.configuration">configuration</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration">RunnerConfiguration</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.instanceProfile">instanceProfile</a></code> | <code>aws-cdk-lib.aws_iam.CfnInstanceProfile</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.machineImage">machineImage</a></code> | <code>aws-cdk-lib.aws_ec2.IMachineImage</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.keyPair">keyPair</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `configuration`<sup>Required</sup> <a name="configuration" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.configuration"></a>

```typescript
public readonly configuration: RunnerConfiguration;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration">RunnerConfiguration</a>

---

##### `instanceProfile`<sup>Required</sup> <a name="instanceProfile" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.instanceProfile"></a>

```typescript
public readonly instanceProfile: CfnInstanceProfile;
```

- *Type:* aws-cdk-lib.aws_iam.CfnInstanceProfile

---

##### `instanceType`<sup>Required</sup> <a name="instanceType" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType

---

##### `machineImage`<sup>Required</sup> <a name="machineImage" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* aws-cdk-lib.aws_ec2.IMachineImage

---

##### `role`<sup>Required</sup> <a name="role" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `keyPair`<sup>Optional</sup> <a name="keyPair" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner.property.keyPair"></a>

```typescript
public readonly keyPair: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret

---


### GitlabRunnerAutoscalingManager <a name="GitlabRunnerAutoscalingManager" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager"></a>

Settings for the manager (coordinator).

Manager coordinates the placement of runner (job executor) instances

#### Initializers <a name="Initializers" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingManager } from '@pepperize/cdk-autoscaling-gitlab-runner'

new GitlabRunnerAutoscalingManager(scope: Construct, id: string, props: GitlabRunnerAutoscalingManagerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.Initializer.parameter.props">props</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps">GitlabRunnerAutoscalingManagerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.Initializer.parameter.props"></a>

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps">GitlabRunnerAutoscalingManagerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.isConstruct"></a>

```typescript
import { GitlabRunnerAutoscalingManager } from '@pepperize/cdk-autoscaling-gitlab-runner'

GitlabRunnerAutoscalingManager.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.cacheBucket">cacheBucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.globalConfiguration">globalConfiguration</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration">GlobalConfiguration</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.initConfig">initConfig</a></code> | <code>aws-cdk-lib.aws_ec2.CloudFormationInit</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.machineImage">machineImage</a></code> | <code>aws-cdk-lib.aws_ec2.IMachineImage</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.network">network</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network">Network</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.runners">runners</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner">GitlabRunnerAutoscalingJobRunner</a>[]</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.runnersSecurityGroupName">runnersSecurityGroupName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.userData">userData</a></code> | <code>aws-cdk-lib.aws_ec2.UserData</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.keyPairName">keyPairName</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `cacheBucket`<sup>Required</sup> <a name="cacheBucket" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.cacheBucket"></a>

```typescript
public readonly cacheBucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `globalConfiguration`<sup>Required</sup> <a name="globalConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.globalConfiguration"></a>

```typescript
public readonly globalConfiguration: GlobalConfiguration;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration">GlobalConfiguration</a>

---

##### `initConfig`<sup>Required</sup> <a name="initConfig" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.initConfig"></a>

```typescript
public readonly initConfig: CloudFormationInit;
```

- *Type:* aws-cdk-lib.aws_ec2.CloudFormationInit

---

##### `instanceType`<sup>Required</sup> <a name="instanceType" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType

---

##### `machineImage`<sup>Required</sup> <a name="machineImage" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* aws-cdk-lib.aws_ec2.IMachineImage

---

##### `network`<sup>Required</sup> <a name="network" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.network"></a>

```typescript
public readonly network: Network;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network">Network</a>

---

##### `role`<sup>Required</sup> <a name="role" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `runners`<sup>Required</sup> <a name="runners" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.runners"></a>

```typescript
public readonly runners: GitlabRunnerAutoscalingJobRunner[];
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner">GitlabRunnerAutoscalingJobRunner</a>[]

---

##### `runnersSecurityGroupName`<sup>Required</sup> <a name="runnersSecurityGroupName" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.runnersSecurityGroupName"></a>

```typescript
public readonly runnersSecurityGroupName: string;
```

- *Type:* string

---

##### `userData`<sup>Required</sup> <a name="userData" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.userData"></a>

```typescript
public readonly userData: UserData;
```

- *Type:* aws-cdk-lib.aws_ec2.UserData

---

##### `keyPairName`<sup>Optional</sup> <a name="keyPairName" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManager.property.keyPairName"></a>

```typescript
public readonly keyPairName: string;
```

- *Type:* string

---


### Network <a name="Network" id="@pepperize/cdk-autoscaling-gitlab-runner.Network"></a>

Network settings for the manager and runners.

All EC2 instances should belong to the same subnet, availability zone and vpc.

#### Initializers <a name="Initializers" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.Initializer"></a>

```typescript
import { Network } from '@pepperize/cdk-autoscaling-gitlab-runner'

new Network(scope: Construct, id: string, props?: NetworkProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.Initializer.parameter.props">props</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps">NetworkProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.Initializer.parameter.props"></a>

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps">NetworkProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.hasPrivateSubnets">hasPrivateSubnets</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `hasPrivateSubnets` <a name="hasPrivateSubnets" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.hasPrivateSubnets"></a>

```typescript
public hasPrivateSubnets(): boolean
```

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.isConstruct"></a>

```typescript
import { Network } from '@pepperize/cdk-autoscaling-gitlab-runner'

Network.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.property.availabilityZone">availabilityZone</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.property.subnet">subnet</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `availabilityZone`<sup>Required</sup> <a name="availabilityZone" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.property.availabilityZone"></a>

```typescript
public readonly availabilityZone: string;
```

- *Type:* string

---

##### `subnet`<sup>Required</sup> <a name="subnet" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.property.subnet"></a>

```typescript
public readonly subnet: ISubnet;
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="@pepperize/cdk-autoscaling-gitlab-runner.Network.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

---


## Structs <a name="Structs" id="Structs"></a>

### AutoscalingConfiguration <a name="AutoscalingConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration"></a>

> [https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections)

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.Initializer"></a>

```typescript
import { AutoscalingConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const autoscalingConfiguration: AutoscalingConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.idleCount">idleCount</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.idleTime">idleTime</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.periods">periods</a></code> | <code>string[]</code> | The Periods setting contains an array of string patterns of time periods represented in a cron-style format. https://github.com/gorhill/cronexpr#implementation. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.timezone">timezone</a></code> | <code>string</code> | *No description.* |

---

##### `idleCount`<sup>Optional</sup> <a name="idleCount" id="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.idleCount"></a>

```typescript
public readonly idleCount: number;
```

- *Type:* number

---

##### `idleTime`<sup>Optional</sup> <a name="idleTime" id="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.idleTime"></a>

```typescript
public readonly idleTime: number;
```

- *Type:* number

---

##### `periods`<sup>Optional</sup> <a name="periods" id="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.periods"></a>

```typescript
public readonly periods: string[];
```

- *Type:* string[]

The Periods setting contains an array of string patterns of time periods represented in a cron-style format. https://github.com/gorhill/cronexpr#implementation.

[second] [minute] [hour] [day of month] [month] [day of week] [year]

---

*Example*

```typescript
// "* * 7-22 * * mon-fri *"
```


##### `timezone`<sup>Optional</sup> <a name="timezone" id="@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration.property.timezone"></a>

```typescript
public readonly timezone: string;
```

- *Type:* string

---

### CacheConfiguration <a name="CacheConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.Initializer"></a>

```typescript
import { CacheConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const cacheConfiguration: CacheConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.property.s3">s3</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration">CacheS3Configuration</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.property.shared">shared</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.property.type">type</a></code> | <code>string</code> | *No description.* |

---

##### `s3`<sup>Optional</sup> <a name="s3" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.property.s3"></a>

```typescript
public readonly s3: CacheS3Configuration;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration">CacheS3Configuration</a>

---

##### `shared`<sup>Optional</sup> <a name="shared" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.property.shared"></a>

```typescript
public readonly shared: boolean;
```

- *Type:* boolean

---

##### `type`<sup>Optional</sup> <a name="type" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

---

### CacheProps <a name="CacheProps" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheProps"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheProps.Initializer"></a>

```typescript
import { CacheProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const cacheProps: CacheProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheProps.property.bucketName">bucketName</a></code> | <code>string</code> | The infix of the physical cache bucket name. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheProps.property.expiration">expiration</a></code> | <code>aws-cdk-lib.Duration</code> | The number of days after which the created cache objects are deleted from S3. |

---

##### `bucketName`<sup>Optional</sup> <a name="bucketName" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheProps.property.bucketName"></a>

```typescript
public readonly bucketName: string;
```

- *Type:* string
- *Default:* "runner-cache"

The infix of the physical cache bucket name.

---

##### `expiration`<sup>Optional</sup> <a name="expiration" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheProps.property.expiration"></a>

```typescript
public readonly expiration: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* 30 days

The number of days after which the created cache objects are deleted from S3.

---

### CacheS3Configuration <a name="CacheS3Configuration" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration"></a>

Define cache configuration for S3 storage.

> [https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section)

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.Initializer"></a>

```typescript
import { CacheS3Configuration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const cacheS3Configuration: CacheS3Configuration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.accessKey">accessKey</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.authenticationType">authenticationType</a></code> | <code>string</code> | In GitLab 15.0 and later, explicitly set AuthenticationType to iam or access-key. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.bucketLocation">bucketLocation</a></code> | <code>string</code> | The name of the S3 region. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.bucketName">bucketName</a></code> | <code>string</code> | The name of the storage bucket where cache is stored. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.insecure">insecure</a></code> | <code>boolean</code> | Set to true if the S3 service is available by HTTP. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.secretKey">secretKey</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.serverAddress">serverAddress</a></code> | <code>string</code> | The AWS S3 host. |

---

##### `accessKey`<sup>Optional</sup> <a name="accessKey" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.accessKey"></a>

```typescript
public readonly accessKey: string;
```

- *Type:* string

---

##### `authenticationType`<sup>Optional</sup> <a name="authenticationType" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.authenticationType"></a>

```typescript
public readonly authenticationType: string;
```

- *Type:* string
- *Default:* "iam"

In GitLab 15.0 and later, explicitly set AuthenticationType to iam or access-key.

> [https://gitlab.com/gitlab-org/gitlab-runner/-/issues/28171](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/28171)

---

##### `bucketLocation`<sup>Optional</sup> <a name="bucketLocation" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.bucketLocation"></a>

```typescript
public readonly bucketLocation: string;
```

- *Type:* string

The name of the S3 region.

---

##### `bucketName`<sup>Optional</sup> <a name="bucketName" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.bucketName"></a>

```typescript
public readonly bucketName: string;
```

- *Type:* string
- *Default:* "runners-cache"

The name of the storage bucket where cache is stored.

---

##### `insecure`<sup>Optional</sup> <a name="insecure" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.insecure"></a>

```typescript
public readonly insecure: boolean;
```

- *Type:* boolean
- *Default:* false

Set to true if the S3 service is available by HTTP.

---

##### `secretKey`<sup>Optional</sup> <a name="secretKey" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.secretKey"></a>

```typescript
public readonly secretKey: string;
```

- *Type:* string

---

##### `serverAddress`<sup>Optional</sup> <a name="serverAddress" id="@pepperize/cdk-autoscaling-gitlab-runner.CacheS3Configuration.property.serverAddress"></a>

```typescript
public readonly serverAddress: string;
```

- *Type:* string
- *Default:* "s3.amazonaws.com"

The AWS S3 host.

---

### ConfigurationMapperProps <a name="ConfigurationMapperProps" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.Initializer"></a>

```typescript
import { ConfigurationMapperProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const configurationMapperProps: ConfigurationMapperProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.globalConfiguration">globalConfiguration</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration">GlobalConfiguration</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.runnersConfiguration">runnersConfiguration</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration">RunnerConfiguration</a>[]</code> | *No description.* |

---

##### `globalConfiguration`<sup>Required</sup> <a name="globalConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.globalConfiguration"></a>

```typescript
public readonly globalConfiguration: GlobalConfiguration;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration">GlobalConfiguration</a>

---

##### `runnersConfiguration`<sup>Required</sup> <a name="runnersConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps.property.runnersConfiguration"></a>

```typescript
public readonly runnersConfiguration: RunnerConfiguration[];
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration">RunnerConfiguration</a>[]

---

### DockerConfiguration <a name="DockerConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration"></a>

Configure docker on the runners.

> [https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section)

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.Initializer"></a>

```typescript
import { DockerConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const dockerConfiguration: DockerConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.allowedImages">allowedImages</a></code> | <code>string[]</code> | Wildcard list of images that can be specified in the .gitlab-ci.yml file. If not present, all images are allowed (equivalent to ["*\/*:*"]). See Restrict Docker images and services. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.allowedServices">allowedServices</a></code> | <code>string[]</code> | Wildcard list of services that can be specified in the .gitlab-ci.yml file. If not present, all images are allowed (equivalent to [*\/*:*]). See Restrict Docker images and services. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cacheDir">cacheDir</a></code> | <code>string</code> | Directory where Docker caches should be stored. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.capAdd">capAdd</a></code> | <code>string[]</code> | Add additional Linux capabilities to the container. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.capDrop">capDrop</a></code> | <code>string[]</code> | Drop additional Linux capabilities from the container. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cpus">cpus</a></code> | <code>string</code> | Number of CPUs (available in Docker 1.13 or later. A string. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cpusetCpus">cpusetCpus</a></code> | <code>string</code> | The control group’s CpusetCpus. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cpuShares">cpuShares</a></code> | <code>number</code> | Number of CPU shares used to set relative CPU usage. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.devices">devices</a></code> | <code>string[]</code> | Share additional host devices with the container. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.disableCache">disableCache</a></code> | <code>boolean</code> | The Docker executor has two levels of caching: a global one (like any other executor) and a local cache based on Docker volumes. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.disableEntrypointOverwrite">disableEntrypointOverwrite</a></code> | <code>boolean</code> | Disable the image entrypoint overwriting. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.dns">dns</a></code> | <code>string[]</code> | A list of DNS servers for the container to use. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.dnsSearch">dnsSearch</a></code> | <code>string[]</code> | A list of DNS search domains. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.extraHosts">extraHosts</a></code> | <code>string[]</code> | Hosts that should be defined in container environment. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.gpus">gpus</a></code> | <code>string[]</code> | GPU devices for Docker container. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.helperImage">helperImage</a></code> | <code>string</code> | (Advanced) The default helper image used to clone repositories and upload artifacts. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.helperImageFlavor">helperImageFlavor</a></code> | <code>string</code> | Sets the helper image flavor (alpine, alpine3.12, alpine3.13, alpine3.14 or ubuntu). Defaults to alpine. The alpine flavor uses the same version as alpine3.12. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.host">host</a></code> | <code>string</code> | Custom Docker endpoint. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.hostname">hostname</a></code> | <code>string</code> | Custom hostname for the Docker container. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.image">image</a></code> | <code>string</code> | The image to run jobs with. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.links">links</a></code> | <code>string[]</code> | Containers that should be linked with container that runs the job. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.memory">memory</a></code> | <code>string</code> | The memory limit. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.memoryReservation">memoryReservation</a></code> | <code>string</code> | The memory soft limit. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.memorySwap">memorySwap</a></code> | <code>string</code> | The total memory limit. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.networkMode">networkMode</a></code> | <code>string</code> | Add container to a custom network. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.oomKillDisable">oomKillDisable</a></code> | <code>boolean</code> | If an out-of-memory (OOM) error occurs, do not kill processes in a container. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.oomScoreAdjust">oomScoreAdjust</a></code> | <code>string</code> | OOM score adjustment. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.privileged">privileged</a></code> | <code>boolean</code> | Make the container run in privileged mode. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.pullPolicy">pullPolicy</a></code> | <code>string</code> | The image pull policy: never, if-not-present or always (default). |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.runtime">runtime</a></code> | <code>string</code> | The runtime for the Docker container. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.securityOpt">securityOpt</a></code> | <code>string</code> | Security options (–security-opt in docker run). |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.shmSize">shmSize</a></code> | <code>number</code> | Shared memory size for images (in bytes). |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.sysctls">sysctls</a></code> | <code>string</code> | The sysctl options. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.tlsCertPath">tlsCertPath</a></code> | <code>string</code> | A directory where ca.pem, cert.pem or key.pem are stored and used to make a secure TLS connection to Docker. Useful in boot2docker. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.tlsVerify">tlsVerify</a></code> | <code>boolean</code> | Enable or disable TLS verification of connections to Docker daemon. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.usernsMode">usernsMode</a></code> | <code>string</code> | The user namespace mode for the container and Docker services when user namespace remapping option is enabled. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.volumeDriver">volumeDriver</a></code> | <code>string</code> | The volume driver to use for the container. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.volumes">volumes</a></code> | <code>string[]</code> | Additional volumes that should be mounted. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.volumesFrom">volumesFrom</a></code> | <code>string[]</code> | A list of volumes to inherit from another container in the form <container name>[:<ro\|rw>]. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.waitForServicesTimeout">waitForServicesTimeout</a></code> | <code>number</code> | How long to wait for Docker services. |

---

##### `allowedImages`<sup>Optional</sup> <a name="allowedImages" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.allowedImages"></a>

```typescript
public readonly allowedImages: string[];
```

- *Type:* string[]

Wildcard list of images that can be specified in the .gitlab-ci.yml file. If not present, all images are allowed (equivalent to ["*\/*:*"]). See Restrict Docker images and services.

---

##### `allowedServices`<sup>Optional</sup> <a name="allowedServices" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.allowedServices"></a>

```typescript
public readonly allowedServices: string[];
```

- *Type:* string[]

Wildcard list of services that can be specified in the .gitlab-ci.yml file. If not present, all images are allowed (equivalent to [*\/*:*]). See Restrict Docker images and services.

---

##### `cacheDir`<sup>Optional</sup> <a name="cacheDir" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cacheDir"></a>

```typescript
public readonly cacheDir: string;
```

- *Type:* string

Directory where Docker caches should be stored.

This path can be absolute or relative to current working directory. See disable_cache for more information.

---

##### `capAdd`<sup>Optional</sup> <a name="capAdd" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.capAdd"></a>

```typescript
public readonly capAdd: string[];
```

- *Type:* string[]
- *Default:* ["CAP_SYS_ADMIN"]

Add additional Linux capabilities to the container.

---

##### `capDrop`<sup>Optional</sup> <a name="capDrop" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.capDrop"></a>

```typescript
public readonly capDrop: string[];
```

- *Type:* string[]

Drop additional Linux capabilities from the container.

---

##### `cpus`<sup>Optional</sup> <a name="cpus" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cpus"></a>

```typescript
public readonly cpus: string;
```

- *Type:* string

Number of CPUs (available in Docker 1.13 or later. A string.

---

##### `cpusetCpus`<sup>Optional</sup> <a name="cpusetCpus" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cpusetCpus"></a>

```typescript
public readonly cpusetCpus: string;
```

- *Type:* string

The control group’s CpusetCpus.

A string.

---

##### `cpuShares`<sup>Optional</sup> <a name="cpuShares" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.cpuShares"></a>

```typescript
public readonly cpuShares: number;
```

- *Type:* number

Number of CPU shares used to set relative CPU usage.

Default is 1024.

---

##### `devices`<sup>Optional</sup> <a name="devices" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.devices"></a>

```typescript
public readonly devices: string[];
```

- *Type:* string[]

Share additional host devices with the container.

---

##### `disableCache`<sup>Optional</sup> <a name="disableCache" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.disableCache"></a>

```typescript
public readonly disableCache: boolean;
```

- *Type:* boolean
- *Default:* false

The Docker executor has two levels of caching: a global one (like any other executor) and a local cache based on Docker volumes.

This configuration flag acts only on the local one which disables the use of automatically created (not mapped to a host directory) cache volumes. In other words, it only prevents creating a container that holds temporary files of builds, it does not disable the cache if the runner is configured in distributed cache mode.

---

##### `disableEntrypointOverwrite`<sup>Optional</sup> <a name="disableEntrypointOverwrite" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.disableEntrypointOverwrite"></a>

```typescript
public readonly disableEntrypointOverwrite: boolean;
```

- *Type:* boolean

Disable the image entrypoint overwriting.

---

##### `dns`<sup>Optional</sup> <a name="dns" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.dns"></a>

```typescript
public readonly dns: string[];
```

- *Type:* string[]

A list of DNS servers for the container to use.

---

##### `dnsSearch`<sup>Optional</sup> <a name="dnsSearch" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.dnsSearch"></a>

```typescript
public readonly dnsSearch: string[];
```

- *Type:* string[]

A list of DNS search domains.

---

##### `extraHosts`<sup>Optional</sup> <a name="extraHosts" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.extraHosts"></a>

```typescript
public readonly extraHosts: string[];
```

- *Type:* string[]

Hosts that should be defined in container environment.

---

##### `gpus`<sup>Optional</sup> <a name="gpus" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.gpus"></a>

```typescript
public readonly gpus: string[];
```

- *Type:* string[]

GPU devices for Docker container.

Uses the same format as the docker cli. View details in the Docker documentation.

---

##### `helperImage`<sup>Optional</sup> <a name="helperImage" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.helperImage"></a>

```typescript
public readonly helperImage: string;
```

- *Type:* string

(Advanced) The default helper image used to clone repositories and upload artifacts.

---

##### `helperImageFlavor`<sup>Optional</sup> <a name="helperImageFlavor" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.helperImageFlavor"></a>

```typescript
public readonly helperImageFlavor: string;
```

- *Type:* string

Sets the helper image flavor (alpine, alpine3.12, alpine3.13, alpine3.14 or ubuntu). Defaults to alpine. The alpine flavor uses the same version as alpine3.12.

---

##### `host`<sup>Optional</sup> <a name="host" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.host"></a>

```typescript
public readonly host: string;
```

- *Type:* string

Custom Docker endpoint.

Default is DOCKER_HOST environment or unix:///var/run/docker.sock.

---

##### `hostname`<sup>Optional</sup> <a name="hostname" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.hostname"></a>

```typescript
public readonly hostname: string;
```

- *Type:* string

Custom hostname for the Docker container.

---

##### `image`<sup>Optional</sup> <a name="image" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* string

The image to run jobs with.

---

##### `links`<sup>Optional</sup> <a name="links" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.links"></a>

```typescript
public readonly links: string[];
```

- *Type:* string[]

Containers that should be linked with container that runs the job.

---

##### `memory`<sup>Optional</sup> <a name="memory" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.memory"></a>

```typescript
public readonly memory: string;
```

- *Type:* string

The memory limit.

A string.

---

##### `memoryReservation`<sup>Optional</sup> <a name="memoryReservation" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.memoryReservation"></a>

```typescript
public readonly memoryReservation: string;
```

- *Type:* string

The memory soft limit.

A string.

---

##### `memorySwap`<sup>Optional</sup> <a name="memorySwap" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.memorySwap"></a>

```typescript
public readonly memorySwap: string;
```

- *Type:* string

The total memory limit.

A string.

---

##### `networkMode`<sup>Optional</sup> <a name="networkMode" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.networkMode"></a>

```typescript
public readonly networkMode: string;
```

- *Type:* string

Add container to a custom network.

---

##### `oomKillDisable`<sup>Optional</sup> <a name="oomKillDisable" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.oomKillDisable"></a>

```typescript
public readonly oomKillDisable: boolean;
```

- *Type:* boolean

If an out-of-memory (OOM) error occurs, do not kill processes in a container.

---

##### `oomScoreAdjust`<sup>Optional</sup> <a name="oomScoreAdjust" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.oomScoreAdjust"></a>

```typescript
public readonly oomScoreAdjust: string;
```

- *Type:* string

OOM score adjustment.

Positive means kill earlier.

---

##### `privileged`<sup>Optional</sup> <a name="privileged" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.privileged"></a>

```typescript
public readonly privileged: boolean;
```

- *Type:* boolean
- *Default:* true

Make the container run in privileged mode.

Insecure.

---

##### `pullPolicy`<sup>Optional</sup> <a name="pullPolicy" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.pullPolicy"></a>

```typescript
public readonly pullPolicy: string;
```

- *Type:* string

The image pull policy: never, if-not-present or always (default).

View details in the pull policies documentation. You can also add multiple pull policies.

---

##### `runtime`<sup>Optional</sup> <a name="runtime" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.runtime"></a>

```typescript
public readonly runtime: string;
```

- *Type:* string

The runtime for the Docker container.

---

##### `securityOpt`<sup>Optional</sup> <a name="securityOpt" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.securityOpt"></a>

```typescript
public readonly securityOpt: string;
```

- *Type:* string

Security options (–security-opt in docker run).

Takes a list of : separated key/values.

---

##### `shmSize`<sup>Optional</sup> <a name="shmSize" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.shmSize"></a>

```typescript
public readonly shmSize: number;
```

- *Type:* number
- *Default:* 0

Shared memory size for images (in bytes).

---

##### `sysctls`<sup>Optional</sup> <a name="sysctls" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.sysctls"></a>

```typescript
public readonly sysctls: string;
```

- *Type:* string

The sysctl options.

---

##### `tlsCertPath`<sup>Optional</sup> <a name="tlsCertPath" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.tlsCertPath"></a>

```typescript
public readonly tlsCertPath: string;
```

- *Type:* string

A directory where ca.pem, cert.pem or key.pem are stored and used to make a secure TLS connection to Docker. Useful in boot2docker.

---

##### `tlsVerify`<sup>Optional</sup> <a name="tlsVerify" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.tlsVerify"></a>

```typescript
public readonly tlsVerify: boolean;
```

- *Type:* boolean
- *Default:* false

Enable or disable TLS verification of connections to Docker daemon.

Disabled by default.

---

##### `usernsMode`<sup>Optional</sup> <a name="usernsMode" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.usernsMode"></a>

```typescript
public readonly usernsMode: string;
```

- *Type:* string

The user namespace mode for the container and Docker services when user namespace remapping option is enabled.

Available in Docker 1.10 or later.

---

##### `volumeDriver`<sup>Optional</sup> <a name="volumeDriver" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.volumeDriver"></a>

```typescript
public readonly volumeDriver: string;
```

- *Type:* string

The volume driver to use for the container.

---

##### `volumes`<sup>Optional</sup> <a name="volumes" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.volumes"></a>

```typescript
public readonly volumes: string[];
```

- *Type:* string[]

Additional volumes that should be mounted.

Same syntax as the Docker -v flag.

---

##### `volumesFrom`<sup>Optional</sup> <a name="volumesFrom" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.volumesFrom"></a>

```typescript
public readonly volumesFrom: string[];
```

- *Type:* string[]

A list of volumes to inherit from another container in the form <container name>[:<ro|rw>].

Access level defaults to read-write, but can be manually set to ro (read-only) or rw (read-write).

---

##### `waitForServicesTimeout`<sup>Optional</sup> <a name="waitForServicesTimeout" id="@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration.property.waitForServicesTimeout"></a>

```typescript
public readonly waitForServicesTimeout: number;
```

- *Type:* number
- *Default:* 300

How long to wait for Docker services.

Set to 0 to disable. Default is 30.

---

### GitlabRunnerAutoscalingCacheProps <a name="GitlabRunnerAutoscalingCacheProps" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps"></a>

The distributed GitLab runner S3 cache.

Either pass an existing bucket or override default options.

> [https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section)

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps.Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingCacheProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingCacheProps: GitlabRunnerAutoscalingCacheProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | An existing S3 bucket used as runner's cache. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps.property.options">options</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheProps">CacheProps</a></code> | If no existing S3 bucket is provided, a S3 bucket will be created. |

---

##### `bucket`<sup>Optional</sup> <a name="bucket" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

An existing S3 bucket used as runner's cache.

---

##### `options`<sup>Optional</sup> <a name="options" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps.property.options"></a>

```typescript
public readonly options: CacheProps;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheProps">CacheProps</a>

If no existing S3 bucket is provided, a S3 bucket will be created.

---

### GitlabRunnerAutoscalingJobRunnerProps <a name="GitlabRunnerAutoscalingJobRunnerProps" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps"></a>

The runner EC2 instances configuration.

If not set, the defaults will be used.

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingJobRunnerProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingJobRunnerProps: GitlabRunnerAutoscalingJobRunnerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.configuration">configuration</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration">RunnerConfiguration</a></code> | The runner EC2 instances configuration. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.token">token</a></code> | <code>aws-cdk-lib.aws_ssm.IStringParameter</code> | The runner’s authentication token, which is obtained during runner registration. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | Instance type for runner EC2 instances. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.keyPair">keyPair</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | Optionally pass a custom EC2 KeyPair, that will be used by the manager to connect to the job runner instances. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.machineImage">machineImage</a></code> | <code>aws-cdk-lib.aws_ec2.IMachineImage</code> | An Amazon Machine Image ID for the Runners EC2 instances. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | Optionally pass an IAM role, that get's assigned to the EC2 runner instances via Instance Profile. |

---

##### `configuration`<sup>Required</sup> <a name="configuration" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.configuration"></a>

```typescript
public readonly configuration: RunnerConfiguration;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration">RunnerConfiguration</a>

The runner EC2 instances configuration.

If not set, the defaults will be used.

> [RunnerConfiguration](RunnerConfiguration)

---

##### `token`<sup>Required</sup> <a name="token" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.token"></a>

```typescript
public readonly token: IStringParameter;
```

- *Type:* aws-cdk-lib.aws_ssm.IStringParameter

The runner’s authentication token, which is obtained during runner registration.

Not the same as the registration token.

> [https://docs.gitlab.com/ee/api/runners.html#register-a-new-runner](https://docs.gitlab.com/ee/api/runners.html#register-a-new-runner)

---

##### `instanceType`<sup>Optional</sup> <a name="instanceType" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType
- *Default:* InstanceType.of(InstanceClass.T3, InstanceSize.MICRO)

Instance type for runner EC2 instances.

It's a combination of a class and size.

---

##### `keyPair`<sup>Optional</sup> <a name="keyPair" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.keyPair"></a>

```typescript
public readonly keyPair: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret

Optionally pass a custom EC2 KeyPair, that will be used by the manager to connect to the job runner instances.

<ol>
   <li>Example: <b>aws secretsmanager create-secret --name AnyKeyPairSecret --secret-string "{\"theKeyPairName\":\"<the private key>\",\"theKeyPairName.pub\":\"<the public key>\"}"</b></li>
   <li><b>Additionally configure an unique key pair configuration.machine.machineOptions.keypairName</b></li>
</ol>

---

##### `machineImage`<sup>Optional</sup> <a name="machineImage" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* aws-cdk-lib.aws_ec2.IMachineImage

An Amazon Machine Image ID for the Runners EC2 instances.

If empty the latest Ubuntu 20.04 focal will be looked up.

Any operating system supported by Docker Machine's provisioner.

> [https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/tree/main/libmachine/provision](https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/tree/main/libmachine/provision)

---

##### `role`<sup>Optional</sup> <a name="role" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

Optionally pass an IAM role, that get's assigned to the EC2 runner instances via Instance Profile.

---

### GitlabRunnerAutoscalingManagerBaseProps <a name="GitlabRunnerAutoscalingManagerBaseProps" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps.Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingManagerBaseProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingManagerBaseProps: GitlabRunnerAutoscalingManagerBaseProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | Instance type for manager EC2 instance. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps.property.keyPairName">keyPairName</a></code> | <code>string</code> | A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps.property.machineImage">machineImage</a></code> | <code>aws-cdk-lib.aws_ec2.IMachineImage</code> | An Amazon Machine Image ID for the Manager EC2 instance. |

---

##### `instanceType`<sup>Optional</sup> <a name="instanceType" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType
- *Default:* InstanceType.of(InstanceClass.T3, InstanceSize.NANO)

Instance type for manager EC2 instance.

It's a combination of a class and size.

---

##### `keyPairName`<sup>Optional</sup> <a name="keyPairName" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps.property.keyPairName"></a>

```typescript
public readonly keyPairName: string;
```

- *Type:* string

A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance.

You won't be able to ssh into an instance without the Key Pair.

---

##### `machineImage`<sup>Optional</sup> <a name="machineImage" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* aws-cdk-lib.aws_ec2.IMachineImage

An Amazon Machine Image ID for the Manager EC2 instance.

If empty the latest Amazon 2 Image will be looked up.

Should be RHEL flavor like Amazon Linux 2 with yum available for instance initialization.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-init.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-init.html)

---

### GitlabRunnerAutoscalingManagerProps <a name="GitlabRunnerAutoscalingManagerProps" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingManagerProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingManagerProps: GitlabRunnerAutoscalingManagerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | Instance type for manager EC2 instance. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.keyPairName">keyPairName</a></code> | <code>string</code> | A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.machineImage">machineImage</a></code> | <code>aws-cdk-lib.aws_ec2.IMachineImage</code> | An Amazon Machine Image ID for the Manager EC2 instance. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.cacheBucket">cacheBucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.network">network</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network">Network</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.runners">runners</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner">GitlabRunnerAutoscalingJobRunner</a>[]</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.runnersSecurityGroup">runnersSecurityGroup</a></code> | <code>@pepperize/cdk-security-group.SecurityGroup</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.globalConfiguration">globalConfiguration</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration">GlobalConfiguration</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |

---

##### `instanceType`<sup>Optional</sup> <a name="instanceType" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType
- *Default:* InstanceType.of(InstanceClass.T3, InstanceSize.NANO)

Instance type for manager EC2 instance.

It's a combination of a class and size.

---

##### `keyPairName`<sup>Optional</sup> <a name="keyPairName" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.keyPairName"></a>

```typescript
public readonly keyPairName: string;
```

- *Type:* string

A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance.

You won't be able to ssh into an instance without the Key Pair.

---

##### `machineImage`<sup>Optional</sup> <a name="machineImage" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* aws-cdk-lib.aws_ec2.IMachineImage

An Amazon Machine Image ID for the Manager EC2 instance.

If empty the latest Amazon 2 Image will be looked up.

Should be RHEL flavor like Amazon Linux 2 with yum available for instance initialization.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-init.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-init.html)

---

##### `cacheBucket`<sup>Required</sup> <a name="cacheBucket" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.cacheBucket"></a>

```typescript
public readonly cacheBucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `network`<sup>Required</sup> <a name="network" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.network"></a>

```typescript
public readonly network: Network;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.Network">Network</a>

---

##### `runners`<sup>Required</sup> <a name="runners" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.runners"></a>

```typescript
public readonly runners: GitlabRunnerAutoscalingJobRunner[];
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunner">GitlabRunnerAutoscalingJobRunner</a>[]

---

##### `runnersSecurityGroup`<sup>Required</sup> <a name="runnersSecurityGroup" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.runnersSecurityGroup"></a>

```typescript
public readonly runnersSecurityGroup: SecurityGroup;
```

- *Type:* @pepperize/cdk-security-group.SecurityGroup

---

##### `globalConfiguration`<sup>Optional</sup> <a name="globalConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.globalConfiguration"></a>

```typescript
public readonly globalConfiguration: GlobalConfiguration;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration">GlobalConfiguration</a>

---

##### `role`<sup>Optional</sup> <a name="role" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

### GitlabRunnerAutoscalingProps <a name="GitlabRunnerAutoscalingProps" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps"></a>

Properties of the Gitlab Runner.

You have to provide at least the GitLab's Runner's authentication token.

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.Initializer"></a>

```typescript
import { GitlabRunnerAutoscalingProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const gitlabRunnerAutoscalingProps: GitlabRunnerAutoscalingProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.checkInterval">checkInterval</a></code> | <code>number</code> | The check_interval option defines how often the runner should check GitLab for new jobs\| in seconds. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.concurrent">concurrent</a></code> | <code>number</code> | The limit of the jobs that can be run concurrently across all runners (concurrent). |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.logFormat">logFormat</a></code> | <code>string</code> | The log format. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.logLevel">logLevel</a></code> | <code>string</code> | The log_level. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.runners">runners</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps">GitlabRunnerAutoscalingJobRunnerProps</a>[]</code> | The runner EC2 instances settings. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.cache">cache</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps">GitlabRunnerAutoscalingCacheProps</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.manager">manager</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps">GitlabRunnerAutoscalingManagerBaseProps</a></code> | The manager EC2 instance configuration. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.network">network</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps">NetworkProps</a></code> | The network configuration for the Runner. |

---

##### `checkInterval`<sup>Optional</sup> <a name="checkInterval" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.checkInterval"></a>

```typescript
public readonly checkInterval: number;
```

- *Type:* number
- *Default:* 0

The check_interval option defines how often the runner should check GitLab for new jobs| in seconds.

---

##### `concurrent`<sup>Optional</sup> <a name="concurrent" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.concurrent"></a>

```typescript
public readonly concurrent: number;
```

- *Type:* number
- *Default:* 10

The limit of the jobs that can be run concurrently across all runners (concurrent).

---

##### `logFormat`<sup>Optional</sup> <a name="logFormat" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.logFormat"></a>

```typescript
public readonly logFormat: string;
```

- *Type:* string
- *Default:* "runner"

The log format.

---

##### `logLevel`<sup>Optional</sup> <a name="logLevel" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.logLevel"></a>

```typescript
public readonly logLevel: string;
```

- *Type:* string
- *Default:* "info"

The log_level.

---

##### `runners`<sup>Required</sup> <a name="runners" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.runners"></a>

```typescript
public readonly runners: GitlabRunnerAutoscalingJobRunnerProps[];
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingJobRunnerProps">GitlabRunnerAutoscalingJobRunnerProps</a>[]

The runner EC2 instances settings.

At least one runner should be set up.

> [GitlabRunnerAutoscalingJobRunnerProps](GitlabRunnerAutoscalingJobRunnerProps)

---

##### `cache`<sup>Optional</sup> <a name="cache" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.cache"></a>

```typescript
public readonly cache: GitlabRunnerAutoscalingCacheProps;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingCacheProps">GitlabRunnerAutoscalingCacheProps</a>

---

##### `manager`<sup>Optional</sup> <a name="manager" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.manager"></a>

```typescript
public readonly manager: GitlabRunnerAutoscalingManagerBaseProps;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingManagerBaseProps">GitlabRunnerAutoscalingManagerBaseProps</a>

The manager EC2 instance configuration.

If not set, the defaults will be used.

> [GitlabRunnerAutoscalingManagerBaseProps](GitlabRunnerAutoscalingManagerBaseProps)

---

##### `network`<sup>Optional</sup> <a name="network" id="@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps.property.network"></a>

```typescript
public readonly network: NetworkProps;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps">NetworkProps</a>

The network configuration for the Runner.

If not set, the defaults will be used.

> [NetworkProps](NetworkProps)

---

### GlobalConfiguration <a name="GlobalConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration"></a>

You can change the behavior of GitLab Runner and of individual registered runners.

This imitates the structure of Gitlab Runner advanced configuration that originally is set with config.toml file.

> [https://docs.gitlab.com/runner/configuration/advanced-configuration.html](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.Initializer"></a>

```typescript
import { GlobalConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const globalConfiguration: GlobalConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.checkInterval">checkInterval</a></code> | <code>number</code> | The check_interval option defines how often the runner should check GitLab for new jobs\| in seconds. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.concurrent">concurrent</a></code> | <code>number</code> | The limit of the jobs that can be run concurrently across all runners (concurrent). |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.logFormat">logFormat</a></code> | <code>string</code> | The log format. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.logLevel">logLevel</a></code> | <code>string</code> | The log_level. |

---

##### `checkInterval`<sup>Optional</sup> <a name="checkInterval" id="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.checkInterval"></a>

```typescript
public readonly checkInterval: number;
```

- *Type:* number
- *Default:* 0

The check_interval option defines how often the runner should check GitLab for new jobs| in seconds.

---

##### `concurrent`<sup>Optional</sup> <a name="concurrent" id="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.concurrent"></a>

```typescript
public readonly concurrent: number;
```

- *Type:* number
- *Default:* 10

The limit of the jobs that can be run concurrently across all runners (concurrent).

---

##### `logFormat`<sup>Optional</sup> <a name="logFormat" id="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.logFormat"></a>

```typescript
public readonly logFormat: string;
```

- *Type:* string
- *Default:* "runner"

The log format.

---

##### `logLevel`<sup>Optional</sup> <a name="logLevel" id="@pepperize/cdk-autoscaling-gitlab-runner.GlobalConfiguration.property.logLevel"></a>

```typescript
public readonly logLevel: string;
```

- *Type:* string
- *Default:* "info"

The log_level.

---

### MachineConfiguration <a name="MachineConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.Initializer"></a>

```typescript
import { MachineConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const machineConfiguration: MachineConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.autoscaling">autoscaling</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration">AutoscalingConfiguration</a>[]</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.idleCount">idleCount</a></code> | <code>number</code> | Number of machines that need to be created and waiting in Idle state. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.idleTime">idleTime</a></code> | <code>number</code> | Time (in seconds) for machine to be in Idle state before it is removed. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.machineDriver">machineDriver</a></code> | <code>string</code> | Docker Machine driver. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.machineName">machineName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.machineOptions">machineOptions</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions">MachineOptions</a></code> | Docker Machine options passed to the Docker Machine driver. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.maxBuilds">maxBuilds</a></code> | <code>number</code> | Maximum job (build) count before machine is removed. |

---

##### `autoscaling`<sup>Optional</sup> <a name="autoscaling" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.autoscaling"></a>

```typescript
public readonly autoscaling: AutoscalingConfiguration[];
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.AutoscalingConfiguration">AutoscalingConfiguration</a>[]

---

##### `idleCount`<sup>Optional</sup> <a name="idleCount" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.idleCount"></a>

```typescript
public readonly idleCount: number;
```

- *Type:* number
- *Default:* 0

Number of machines that need to be created and waiting in Idle state.

---

##### `idleTime`<sup>Optional</sup> <a name="idleTime" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.idleTime"></a>

```typescript
public readonly idleTime: number;
```

- *Type:* number
- *Default:* 300

Time (in seconds) for machine to be in Idle state before it is removed.

---

##### `machineDriver`<sup>Optional</sup> <a name="machineDriver" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.machineDriver"></a>

```typescript
public readonly machineDriver: string;
```

- *Type:* string
- *Default:* "amazonec2"

Docker Machine driver.

---

##### `machineName`<sup>Optional</sup> <a name="machineName" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.machineName"></a>

```typescript
public readonly machineName: string;
```

- *Type:* string
- *Default:* "gitlab-runner"

---

##### `machineOptions`<sup>Optional</sup> <a name="machineOptions" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.machineOptions"></a>

```typescript
public readonly machineOptions: MachineOptions;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions">MachineOptions</a>

Docker Machine options passed to the Docker Machine driver.

---

##### `maxBuilds`<sup>Optional</sup> <a name="maxBuilds" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration.property.maxBuilds"></a>

```typescript
public readonly maxBuilds: number;
```

- *Type:* number
- *Default:* 20

Maximum job (build) count before machine is removed.

---

### MachineOptions <a name="MachineOptions" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions"></a>

> [https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go](https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go)

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.Initializer"></a>

```typescript
import { MachineOptions } from '@pepperize/cdk-autoscaling-gitlab-runner'

const machineOptions: MachineOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.ami">ami</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.blockDurationMinutes">blockDurationMinutes</a></code> | <code>number</code> | The amazonec2-block-duration-minutes parameter. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.iamInstanceProfile">iamInstanceProfile</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.instanceType">instanceType</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.keypairName">keypairName</a></code> | <code>string</code> | The amazonec2-keypair-name parameter. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.metadataToken">metadataToken</a></code> | <code>string</code> | Whether the metadata token is required or optional. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.metadataTokenResponseHopLimit">metadataTokenResponseHopLimit</a></code> | <code>number</code> | The number of network hops that the metadata token can travel. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.privateAddressOnly">privateAddressOnly</a></code> | <code>boolean</code> | The amazonec2-private-address-only parameter. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.region">region</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.requestSpotInstance">requestSpotInstance</a></code> | <code>boolean</code> | The amazonec2-request-spot-instance parameter. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.rootSize">rootSize</a></code> | <code>number</code> | The root disk size of the instance (in GB). |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.securityGroup">securityGroup</a></code> | <code>string</code> | The SecurityGroup's GroupName, not the GroupId. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.spotPrice">spotPrice</a></code> | <code>number</code> | The amazonec2-spot-price parameter. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.sshKeypath">sshKeypath</a></code> | <code>string</code> | The amazonec2-ssh-keypath parameter. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.subnetId">subnetId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.useEbsOptimizedInstance">useEbsOptimizedInstance</a></code> | <code>boolean</code> | Create an EBS Optimized Instance, instance type must support it. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.usePrivateAddress">usePrivateAddress</a></code> | <code>boolean</code> | Use the private IP address of Docker Machines, but still create a public IP address. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.userdata">userdata</a></code> | <code>string</code> | The path of the runner machine's userdata file on the manager instance used by the amazonec2 driver to create a new instance. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.volumeType">volumeType</a></code> | <code>string</code> | The Amazon EBS volume type to be attached to the instance. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.vpcId">vpcId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.zone">zone</a></code> | <code>string</code> | Extract the availabilityZone last character for the needs of gitlab configuration. |

---

##### `ami`<sup>Optional</sup> <a name="ami" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.ami"></a>

```typescript
public readonly ami: string;
```

- *Type:* string

---

##### `blockDurationMinutes`<sup>Optional</sup> <a name="blockDurationMinutes" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.blockDurationMinutes"></a>

```typescript
public readonly blockDurationMinutes: number;
```

- *Type:* number

The amazonec2-block-duration-minutes parameter.

AWS spot instance duration in minutes (60, 120, 180, 240, 300, or 360).

> [https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances](https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#cutting-down-costs-with-amazon-ec2-spot-instances)

---

##### `iamInstanceProfile`<sup>Optional</sup> <a name="iamInstanceProfile" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.iamInstanceProfile"></a>

```typescript
public readonly iamInstanceProfile: string;
```

- *Type:* string

---

##### `instanceType`<sup>Optional</sup> <a name="instanceType" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.instanceType"></a>

```typescript
public readonly instanceType: string;
```

- *Type:* string

---

##### `keypairName`<sup>Optional</sup> <a name="keypairName" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.keypairName"></a>

```typescript
public readonly keypairName: string;
```

- *Type:* string

The amazonec2-keypair-name parameter.

A set of security credentials that you use to prove your identity when connecting to an Amazon EC2 instance.

<b>using --amazonec2-keypair-name also requires --amazonec2-ssh-keypath</b>

> [https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go#L398](https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go#L398)

---

##### `metadataToken`<sup>Optional</sup> <a name="metadataToken" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.metadataToken"></a>

```typescript
public readonly metadataToken: string;
```

- *Type:* string
- *Default:* required

Whether the metadata token is required or optional.

> [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html)

---

##### `metadataTokenResponseHopLimit`<sup>Optional</sup> <a name="metadataTokenResponseHopLimit" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.metadataTokenResponseHopLimit"></a>

```typescript
public readonly metadataTokenResponseHopLimit: number;
```

- *Type:* number
- *Default:* 2

The number of network hops that the metadata token can travel.

---

##### `privateAddressOnly`<sup>Optional</sup> <a name="privateAddressOnly" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.privateAddressOnly"></a>

```typescript
public readonly privateAddressOnly: boolean;
```

- *Type:* boolean

The amazonec2-private-address-only parameter.

If true, your EC2 instance won’t get assigned a public IP. This is ok if your VPC is configured correctly with an Internet Gateway (IGW), NatGateway (NGW) and routing is fine, but it’s something to consider if you’ve got a more complex configuration.

> [https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section](https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section)

---

##### `region`<sup>Optional</sup> <a name="region" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

---

##### `requestSpotInstance`<sup>Optional</sup> <a name="requestSpotInstance" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.requestSpotInstance"></a>

```typescript
public readonly requestSpotInstance: boolean;
```

- *Type:* boolean
- *Default:* true

The amazonec2-request-spot-instance parameter.

Whether or not to request spot instances.

> [https://aws.amazon.com/ec2/spot/](https://aws.amazon.com/ec2/spot/)

---

##### `rootSize`<sup>Optional</sup> <a name="rootSize" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.rootSize"></a>

```typescript
public readonly rootSize: number;
```

- *Type:* number
- *Default:* 16

The root disk size of the instance (in GB).

> [https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/docs/drivers/aws.md#options](https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/docs/drivers/aws.md#options)

---

##### `securityGroup`<sup>Optional</sup> <a name="securityGroup" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.securityGroup"></a>

```typescript
public readonly securityGroup: string;
```

- *Type:* string

The SecurityGroup's GroupName, not the GroupId.

---

##### `spotPrice`<sup>Optional</sup> <a name="spotPrice" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.spotPrice"></a>

```typescript
public readonly spotPrice: number;
```

- *Type:* number
- *Default:* 0.03

The amazonec2-spot-price parameter.

The bidding price for spot instances.

> [https://aws.amazon.com/ec2/spot/pricing/](https://aws.amazon.com/ec2/spot/pricing/)

---

##### `sshKeypath`<sup>Optional</sup> <a name="sshKeypath" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.sshKeypath"></a>

```typescript
public readonly sshKeypath: string;
```

- *Type:* string
- *Default:* /etc/gitlab-runner/ssh

The amazonec2-ssh-keypath parameter.

---

##### `subnetId`<sup>Optional</sup> <a name="subnetId" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.subnetId"></a>

```typescript
public readonly subnetId: string;
```

- *Type:* string

---

##### `useEbsOptimizedInstance`<sup>Optional</sup> <a name="useEbsOptimizedInstance" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.useEbsOptimizedInstance"></a>

```typescript
public readonly useEbsOptimizedInstance: boolean;
```

- *Type:* boolean

Create an EBS Optimized Instance, instance type must support it.

---

##### `usePrivateAddress`<sup>Optional</sup> <a name="usePrivateAddress" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.usePrivateAddress"></a>

```typescript
public readonly usePrivateAddress: boolean;
```

- *Type:* boolean

Use the private IP address of Docker Machines, but still create a public IP address.

Useful to keep the traffic internal and avoid extra costs.

> [https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section](https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section)

---

##### `userdata`<sup>Optional</sup> <a name="userdata" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.userdata"></a>

```typescript
public readonly userdata: string;
```

- *Type:* string
- *Default:* /etc/gitlab-runner/user_data_runners

The path of the runner machine's userdata file on the manager instance used by the amazonec2 driver to create a new instance.

> [https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go](https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go)

---

##### `volumeType`<sup>Optional</sup> <a name="volumeType" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.volumeType"></a>

```typescript
public readonly volumeType: string;
```

- *Type:* string
- *Default:* gp2

The Amazon EBS volume type to be attached to the instance.

---

##### `vpcId`<sup>Optional</sup> <a name="vpcId" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.vpcId"></a>

```typescript
public readonly vpcId: string;
```

- *Type:* string

---

##### `zone`<sup>Optional</sup> <a name="zone" id="@pepperize/cdk-autoscaling-gitlab-runner.MachineOptions.property.zone"></a>

```typescript
public readonly zone: string;
```

- *Type:* string

Extract the availabilityZone last character for the needs of gitlab configuration.

> [https://docs.gitlab.com/runners/configuration/runners_autoscale_aws/#the-runnerssmachine-section](https://docs.gitlab.com/runners/configuration/runners_autoscale_aws/#the-runnerssmachine-section)

---

### NetworkProps <a name="NetworkProps" id="@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps.Initializer"></a>

```typescript
import { NetworkProps } from '@pepperize/cdk-autoscaling-gitlab-runner'

const networkProps: NetworkProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps.property.subnetSelection">subnetSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | The GitLab Runner's subnets. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | If no existing VPC is provided, a default Vpc will be created. |

---

##### `subnetSelection`<sup>Optional</sup> <a name="subnetSelection" id="@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps.property.subnetSelection"></a>

```typescript
public readonly subnetSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

The GitLab Runner's subnets.

It should be either public or private. If more then subnet is selected, then the first found (private) subnet will be used.

> [https://docs.aws.amazon.com/cdk/api/latest/docs/](https://docs.aws.amazon.com/cdk/api/latest/docs/)

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="@pepperize/cdk-autoscaling-gitlab-runner.NetworkProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

If no existing VPC is provided, a default Vpc will be created.

---

### RunnerConfiguration <a name="RunnerConfiguration" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.Initializer"></a>

```typescript
import { RunnerConfiguration } from '@pepperize/cdk-autoscaling-gitlab-runner'

const runnerConfiguration: RunnerConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.buildsDir">buildsDir</a></code> | <code>string</code> | Absolute path to a directory where builds are stored in the context of the selected executor. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.cache">cache</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration">CacheConfiguration</a></code> | The runner's AWS S3 cache configuration. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.cacheDir">cacheDir</a></code> | <code>string</code> | Absolute path to a directory where build caches are stored in context of selected executor. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.cloneUrl">cloneUrl</a></code> | <code>string</code> | Overwrite the URL for the GitLab instance. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.debugTraceDisabled">debugTraceDisabled</a></code> | <code>boolean</code> | Disables the CI_DEBUG_TRACE feature. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.docker">docker</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration">DockerConfiguration</a></code> | The runner's docker configuration. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.environment">environment</a></code> | <code>string[]</code> | Append or overwrite environment variables. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.executor">executor</a></code> | <code>string</code> | Select how a project should be built. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.limit">limit</a></code> | <code>number</code> | Limit how many jobs can be handled concurrently by this registered runner. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.machine">machine</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration">MachineConfiguration</a></code> | The runner's Docker Machine configuration. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.name">name</a></code> | <code>string</code> | The runner’s description. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.outputLimit">outputLimit</a></code> | <code>number</code> | Maximum build log size in kilobytes. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.postBuildScript">postBuildScript</a></code> | <code>string</code> | Commands to be executed on the runner just after executing the build, but before executing after_script. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.preBuildScript">preBuildScript</a></code> | <code>string</code> | Commands to be executed on the runner after cloning the Git repository, but before executing the build. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.preCloneScript">preCloneScript</a></code> | <code>string</code> | Commands to be executed on the runner before cloning the Git repository. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.referees">referees</a></code> | <code>string</code> | Extra job monitoring workers that pass their results as job artifacts to GitLab. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.requestConcurrency">requestConcurrency</a></code> | <code>number</code> | Limit number of concurrent requests for new jobs from GitLab. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.shell">shell</a></code> | <code>string</code> | Name of shell to generate the script. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.tlsCaFile">tlsCaFile</a></code> | <code>string</code> | When using HTTPS, file that contains the certificates to verify the peer. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.tlsCertFile">tlsCertFile</a></code> | <code>string</code> | When using HTTPS, file that contains the certificate to authenticate with the peer. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.tlsKeyFile">tlsKeyFile</a></code> | <code>string</code> | When using HTTPS, file that contains the private key to authenticate with the peer. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.token">token</a></code> | <code>string</code> | The runner’s authentication token, which is obtained during runner registration. Not the same as the registration token. |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.url">url</a></code> | <code>string</code> | GitLab instance URL. |

---

##### `buildsDir`<sup>Optional</sup> <a name="buildsDir" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.buildsDir"></a>

```typescript
public readonly buildsDir: string;
```

- *Type:* string

Absolute path to a directory where builds are stored in the context of the selected executor.

For example, locally, Docker, or SSH.

---

##### `cache`<sup>Optional</sup> <a name="cache" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.cache"></a>

```typescript
public readonly cache: CacheConfiguration;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.CacheConfiguration">CacheConfiguration</a>

The runner's AWS S3 cache configuration.

> [https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnerscaches3-section)

---

##### `cacheDir`<sup>Optional</sup> <a name="cacheDir" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.cacheDir"></a>

```typescript
public readonly cacheDir: string;
```

- *Type:* string

Absolute path to a directory where build caches are stored in context of selected executor.

For example, locally, Docker, or SSH. If the docker executor is used, this directory needs to be included in its volumes parameter.

---

##### `cloneUrl`<sup>Optional</sup> <a name="cloneUrl" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.cloneUrl"></a>

```typescript
public readonly cloneUrl: string;
```

- *Type:* string

Overwrite the URL for the GitLab instance.

Used only if the runner can’t connect to the GitLab URL.

---

##### `debugTraceDisabled`<sup>Optional</sup> <a name="debugTraceDisabled" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.debugTraceDisabled"></a>

```typescript
public readonly debugTraceDisabled: boolean;
```

- *Type:* boolean

Disables the CI_DEBUG_TRACE feature.

When set to true, then debug log (trace) remains disabled, even if CI_DEBUG_TRACE is set to true by the user.

---

##### `docker`<sup>Optional</sup> <a name="docker" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.docker"></a>

```typescript
public readonly docker: DockerConfiguration;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.DockerConfiguration">DockerConfiguration</a>

The runner's docker configuration.

> [https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section)

---

##### `environment`<sup>Optional</sup> <a name="environment" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.environment"></a>

```typescript
public readonly environment: string[];
```

- *Type:* string[]
- *Default:* ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"]

Append or overwrite environment variables.

---

##### `executor`<sup>Optional</sup> <a name="executor" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.executor"></a>

```typescript
public readonly executor: string;
```

- *Type:* string
- *Default:* "docker+machine"

Select how a project should be built.

---

##### `limit`<sup>Optional</sup> <a name="limit" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.limit"></a>

```typescript
public readonly limit: number;
```

- *Type:* number
- *Default:* 10

Limit how many jobs can be handled concurrently by this registered runner.

0 (default) means do not limit.

---

##### `machine`<sup>Optional</sup> <a name="machine" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.machine"></a>

```typescript
public readonly machine: MachineConfiguration;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.MachineConfiguration">MachineConfiguration</a>

The runner's Docker Machine configuration.

> [https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section](https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section)

---

##### `name`<sup>Optional</sup> <a name="name" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* "gitlab-runner"

The runner’s description.

Informational only.

---

##### `outputLimit`<sup>Optional</sup> <a name="outputLimit" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.outputLimit"></a>

```typescript
public readonly outputLimit: number;
```

- *Type:* number
- *Default:* 52428800 (50GB)

Maximum build log size in kilobytes.

Default is 4096 (4MB).

---

##### `postBuildScript`<sup>Optional</sup> <a name="postBuildScript" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.postBuildScript"></a>

```typescript
public readonly postBuildScript: string;
```

- *Type:* string

Commands to be executed on the runner just after executing the build, but before executing after_script.

To insert multiple commands, use a (triple-quoted) multi-line string or \n character.

---

##### `preBuildScript`<sup>Optional</sup> <a name="preBuildScript" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.preBuildScript"></a>

```typescript
public readonly preBuildScript: string;
```

- *Type:* string

Commands to be executed on the runner after cloning the Git repository, but before executing the build.

To insert multiple commands, use a (triple-quoted) multi-line string or \n character.

---

##### `preCloneScript`<sup>Optional</sup> <a name="preCloneScript" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.preCloneScript"></a>

```typescript
public readonly preCloneScript: string;
```

- *Type:* string

Commands to be executed on the runner before cloning the Git repository.

Use it to adjust the Git client configuration first, for example. To insert multiple commands, use a (triple-quoted) multi-line string or \n character.

---

##### `referees`<sup>Optional</sup> <a name="referees" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.referees"></a>

```typescript
public readonly referees: string;
```

- *Type:* string

Extra job monitoring workers that pass their results as job artifacts to GitLab.

---

##### `requestConcurrency`<sup>Optional</sup> <a name="requestConcurrency" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.requestConcurrency"></a>

```typescript
public readonly requestConcurrency: number;
```

- *Type:* number

Limit number of concurrent requests for new jobs from GitLab.

Default is 1.

---

##### `shell`<sup>Optional</sup> <a name="shell" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.shell"></a>

```typescript
public readonly shell: string;
```

- *Type:* string

Name of shell to generate the script.

Default value is platform dependent.

---

##### `tlsCaFile`<sup>Optional</sup> <a name="tlsCaFile" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.tlsCaFile"></a>

```typescript
public readonly tlsCaFile: string;
```

- *Type:* string

When using HTTPS, file that contains the certificates to verify the peer.

See Self-signed certificates or custom Certification Authorities documentation.

---

##### `tlsCertFile`<sup>Optional</sup> <a name="tlsCertFile" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.tlsCertFile"></a>

```typescript
public readonly tlsCertFile: string;
```

- *Type:* string

When using HTTPS, file that contains the certificate to authenticate with the peer.

---

##### `tlsKeyFile`<sup>Optional</sup> <a name="tlsKeyFile" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.tlsKeyFile"></a>

```typescript
public readonly tlsKeyFile: string;
```

- *Type:* string

When using HTTPS, file that contains the private key to authenticate with the peer.

---

##### `token`<sup>Optional</sup> <a name="token" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.token"></a>

```typescript
public readonly token: string;
```

- *Type:* string

The runner’s authentication token, which is obtained during runner registration. Not the same as the registration token.

<strong>Will be replaced by the runner's props token SSM Parameter</strong>

> [https://docs.gitlab.com/ee/api/runners.html#register-a-new-runner](https://docs.gitlab.com/ee/api/runners.html#register-a-new-runner)

---

##### `url`<sup>Optional</sup> <a name="url" id="@pepperize/cdk-autoscaling-gitlab-runner.RunnerConfiguration.property.url"></a>

```typescript
public readonly url: string;
```

- *Type:* string
- *Default:* "https://gitlab.com"

GitLab instance URL.

---

## Classes <a name="Classes" id="Classes"></a>

### ConfigurationMapper <a name="ConfigurationMapper" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper"></a>

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.toToml">toToml</a></code> | *No description.* |

---

##### `toToml` <a name="toToml" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.toToml"></a>

```typescript
public toToml(): string
```

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.fromProps">fromProps</a></code> | *No description.* |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.withDefaults">withDefaults</a></code> | *No description.* |

---

##### `fromProps` <a name="fromProps" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.fromProps"></a>

```typescript
import { ConfigurationMapper } from '@pepperize/cdk-autoscaling-gitlab-runner'

ConfigurationMapper.fromProps(props: ConfigurationMapperProps)
```

###### `props`<sup>Required</sup> <a name="props" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.fromProps.parameter.props"></a>

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps">ConfigurationMapperProps</a>

---

##### `withDefaults` <a name="withDefaults" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.withDefaults"></a>

```typescript
import { ConfigurationMapper } from '@pepperize/cdk-autoscaling-gitlab-runner'

ConfigurationMapper.withDefaults(props: ConfigurationMapperProps)
```

###### `props`<sup>Required</sup> <a name="props" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.withDefaults.parameter.props"></a>

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps">ConfigurationMapperProps</a>

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.property.props">props</a></code> | <code><a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps">ConfigurationMapperProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapper.property.props"></a>

```typescript
public readonly props: ConfigurationMapperProps;
```

- *Type:* <a href="#@pepperize/cdk-autoscaling-gitlab-runner.ConfigurationMapperProps">ConfigurationMapperProps</a>

---



