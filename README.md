[![GitHub](https://img.shields.io/github/license/pepperize/cdk-autoscaling-gitlab-runner?style=flat-square)](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@pepperize/cdk-autoscaling-gitlab-runner?style=flat-square)](https://www.npmjs.com/package/@pepperize/cdk-autoscaling-gitlab-runner)
[![PyPI](https://img.shields.io/pypi/v/pepperize.cdk-autoscaling-gitlab-runner?style=flat-square)](https://pypi.org/project/pepperize.cdk-autoscaling-gitlab-runner/)
[![Nuget](https://img.shields.io/nuget/v/Pepperize.CDK.AutoscalingGitlabRunner?style=flat-square)](https://www.nuget.org/packages/Pepperize.CDK.AutoscalingGitlabRunner/)
[![Sonatype Nexus (Releases)](https://img.shields.io/nexus/r/com.pepperize/cdk-autoscaling-gitlab-runner?server=https%3A%2F%2Fs01.oss.sonatype.org%2F&style=flat-square)](https://s01.oss.sonatype.org/content/repositories/releases/com/pepperize/cdk-autoscaling-gitlab-runner/)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/pepperize/cdk-autoscaling-gitlab-runner/release/main?label=release&style=flat-square)](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/pepperize/cdk-autoscaling-gitlab-runner?sort=semver&style=flat-square)](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/releases)

# AWS CDK GitLab Runner autoscaling on EC2

This project provides a CDK construct to [execute jobs on auto-scaled EC2 instances](https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/index.html) using the [Docker Machine](https://docs.gitlab.com/runner/executors/docker_machine.html) executor.

> Running out of [Runner minutes](https://about.gitlab.com/pricing/),
> using [Docker-in-Docker (dind)](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html),
> speed up jobs with [shared S3 Cache](https://docs.gitlab.com/runner/configuration/autoscale.html#distributed-runners-caching),
> cross compiling/building environment [multiarch](https://hub.docker.com/r/multiarch/qemu-user-static/),
> cost effective [autoscaling on EC2](https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/#the-runnersmachine-section),
> deploy directly from AWS accounts (without [AWS Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)),
> running on [Spot instances](https://aws.amazon.com/ec2/spot/),
> having a bigger [build log size](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)

## Install

### TypeScript

```shell
npm install @pepperize/cdk-autoscaling-gitlab-runner
```

or

```shell
yarn add @pepperize/cdk-autoscaling-gitlab-runner
```

### Python

```shell
pip install pepperize.cdk-autoscaling-gitlab-runner
```

### C# / .Net

```
dotnet add package Pepperize.CDK.AutoscalingGitlabRunner
```

### Java

```xml
<dependency>
  <groupId>com.pepperize</groupId>
  <artifactId>cdk-autoscaling-gitlab-runner</artifactId>
  <version>${cdkAutoscalingGitlabRunner.version}</version>
</dependency>
```

## Quickstart

1. **Create a new AWS CDK App** in TypeScript with [projen](https://github.com/projen/projen)

   ```shell
   mkdir gitlab-runner
   cd gitlab-runner
   git init
   npx projen new awscdk-app-ts
   ```

2. **Configure your project in `.projenrc.js`**

   - Add `deps: ["@pepperize/cdk-autoscaling-gitlab-runner"],`

3. **Update project files and install dependencies**

   ```shell
   npx projen
   ```

4. **Register a new runner**

   [Registering runners](https://docs.gitlab.com/runner/register/):

   - For a [shared runner](https://docs.gitlab.com/ee/ci/runners/#shared-runners), go to the GitLab Admin Area and click **Overview > Runners**
   - For a [group runner](https://docs.gitlab.com/ee/ci/runners/index.html#group-runners), go to **Settings > CI/CD** and expand the **Runners** section
   - For a [project runner](https://docs.gitlab.com/ee/ci/runners/index.html#specific-runners), go to **Settings > CI/CD** and expand the **Runners** section

   _Optionally enable: **Run untagged jobs** [x]
   Indicates whether this runner can pick jobs without tags_

   See also _[Registration token vs. Authentication token](https://docs.gitlab.com/ee/api/runners.html#registration-and-authentication-tokens)_

5. **Retrieve a new runner authentication token**

   [Register a new runner](https://docs.gitlab.com/ee/api/runners.html#register-a-new-runner)

   ```shell
   curl --request POST "https://gitlab.com/api/v4/runners" --form "token=<your register token>" --form "description=gitlab-runner" --form "tag_list=pepperize,docker,production"
   ```

6. **Store runner authentication token in SSM ParameterStore**

   [Create a String parameter](https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-cli.html#param-create-cli-string)

   ```shell
   aws ssm put-parameter --name "/gitlab-runner/token" --value "<your runner authentication token>" --type "String"
   ```

7. **Add to your `main.ts`**

   ```typescript
   import { Vpc } from "@aws-cdk/aws-ec2";
   import { App, Stack } from "@aws-cdk/core";
   import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";

   const app = new App();
   const stack = new Stack(app, "GitLabRunnerStack");
   const vpc = Vpc.fromLookup(app, "ExistingVpc", {
     vpcId: "<your vpc id>",
   });
   const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
     parameterName: "/gitlab-runner/token",
   });
   new GitlabRunnerAutoscaling(stack, "GitlabRunner", {
     network: {
       vpc: vpc,
     },
     runners: [
       {
         token: token,
         configuration: {
           // optionally configure your runner
         },
       },
     ],
   });
   ```

8. **Create service linked role**

   _(If requesting spot instances, default: true)_

   ```sh
   aws iam create-service-linked-role --aws-service-name spot.amazonaws.com
   ```

9. **Configure the AWS CLI**

   - [AWSume](https://awsu.me/)
   - [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
   - [AWS Single Sign-On](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html)

10. **Deploy the GitLab Runner**

    ```shell
    npm run deploy
    ```

## Example

### Custom cache bucket

By default, an AWS S3 Bucket is created as GitLab Runner's distributed cache.
It's encrypted and public access is blocked.
A custom S3 Bucket can be configured:

```typescript
const cache = new Bucket(this, "Cache", {
  // Your custom bucket
});
const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      token: token,
    },
  ],
  cache: { bucket: cache },
});
```

See [example](https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example/blob/main/src/cache.ts),
[GitlabRunnerAutoscalingCacheProps](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#gitlabrunnerautoscalingcacheprops-)

### Custom EC2 key pair

By default, the [amazonec2](https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go) driver will create an EC2 key pair for each runner. To use custom ssh credentials provide a SecretsManager Secret with the private and public key file:

1. [Create a key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html), download the private key file and remember the created key pair name
2. Generate the public key file
   ```
   ssh-keygen -f <the downloaded private key file> -y
   ```
3. Create an AWS SecretsManager Secret from the key pair
   ```shell
   aws secretsmanager create-secret --name <the secret name> --secret-string "{\"<the key pair name>\":\"<the private key>\",\"<the key pair name>.pub\":\"<the public key>\"}"
   ```
4. Configure the job runner

   ```typescript
   const keyPair = Secret.fromSecretNameV2(stack, "Secret", "CustomEC2KeyPair");

   new GitlabRunnerAutoscaling(this, "Runner", {
     runners: [
       {
         keyPair: keyPair,
         configuration: {
           machine: {
             machineOptions: {
               keypairName: "<the key pair name>",
             },
           },
         },
       },
     ],
     cache: { bucket: cache },
   });
   ```

### Configure Docker Machine

By default, docker machine is configured to run privileged with `CAP_SYS_ADMIN` to support [Docker-in-Docker using the OverlayFS driver](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-the-overlayfs-driver)
and cross compiling/building with [multiarch](https://hub.docker.com/r/multiarch/qemu-user-static/).

See [runners.docker section](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersdocker-section)
in [Advanced configuration](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)

```typescript
import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      token: token,
      configuration: {
        environment: [], // Reset the OverlayFS driver for every project
        docker: {
          capAdd: [], // Remove the CAP_SYS_ADMIN
          privileged: false, // Run unprivileged
        },
        machine: {
          idleCount: 2, // Number of idle machine
          idleTime: 3000, // Waiting time in idle state
          maxBuilds: 1, // Max builds before instance is removed
        },
      },
    },
  ],
});
```

See [example](https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example/blob/main/src/docker-machine.ts),
[DockerConfiguration](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#dockerconfiguration-)

### Bigger instance type

By default, t3.nano is used for the manager/coordinator and t3.micro instances will be spawned.
For bigger projects, for example with [webpack](https://webpack.js.org/), this won't be enough memory.

```typescript
const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  manager: {
    instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
  },
  runners: [
    {
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      token: token,
      configuration: {
        // optionally configure your runner
      },
    },
  ],
});
```

> You may have to disable or configure [Spot instances](#spot-instances)

See [example](https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example/blob/main/src/instance-type.ts),
[GitlabRunnerAutoscalingManagerProps](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#gitlabrunnerautoscalingmanagerprops-),
[GitlabRunnerAutoscalingJobRunnerProps](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#gitlabrunnerautoscalingjobrunnerprops-)

### Different machine image

By default, the latest [Amazon 2 Linux](https://aws.amazon.com/amazon-linux-2/) will be used for the manager/coordinator.
The manager/coordinator instance's cloud init scripts requires [yum](https://access.redhat.com/solutions/9934) is installed, any RHEL flavor should work.
The requested runner instances by default using Ubuntu 20.04, any OS implemented by the [Docker Machine provisioner](https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/tree/main/libmachine/provision) should work.

```typescript
const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  manager: {
    machineImage: MachineImage.genericLinux(managerAmiMap),
  },
  runners: [
    {
      machineImage: MachineImage.genericLinux(runnerAmiMap),
      token: token,
      configuration: {
        // optionally configure your runner
      },
    },
  ],
});
```

See [example](https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example/blob/main/src/machine-image.ts),
[GitlabRunnerAutoscalingManagerProps](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#gitlabrunnerautoscalingmanagerprops-),
[GitlabRunnerAutoscalingJobRunnerProps](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#gitlabrunnerautoscalingjobrunnerprops-)

### Multiple runners configuration

Each runner defines one `[[runners]]` section in the [configuration file](https://docs.gitlab.com/runner/configuration/).
Use [Specific runners](https://docs.gitlab.com/ee/ci/runners/runners_scope.html#specific-runners) when you want to use runners for specific projects.

```typescript
const privilegedRole = new Role(this, "PrivilegedRunnersRole", {
  // role 1
});

const restrictedRole = new Role(this, "RestrictedRunnersRole", {
  // role 2
});

const token1 = StringParameter.fromStringParameterAttributes(stack, "Token1", {
  parameterName: "/gitlab-runner/token1",
});

const token2 = StringParameter.fromStringParameterAttributes(stack, "Token2", {
  parameterName: "/gitlab-runner/token2",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      token: token1,
      configuration: {
        name: "privileged-runner",
      },
      role: privilegedRole,
    },
    {
      token: token2,
      configuration: {
        name: "restricted-runner",
        docker: {
          privileged: false, // Run unprivileged
        },
      },
      role: restrictedRole,
    },
  ],
});
```

See [example](https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example/blob/main/src/machine-image.ts),
[GitlabRunnerAutoscalingProps](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps)

### Spot instances

By default, EC2 Spot Instances are requested.

```typescript
const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      token: token,
      configuration: {
        machine: {
          machineOptions: {
            requestSpotInstance: false,
            spotPrice: 0.5,
          },
        },
      },
    },
  ],
});
```

See [example](https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example/blob/main/src/on-demand-instances.ts),
[EC2 spot price](https://aws.amazon.com/de/ec2/spot/pricing/),
[MachineConfiguration](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#machineconfiguration-),
[MachineOptions](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#machineoptions-),
[Advanced configuration - runners.machine.autoscaling](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections)

### Cross-Compile with Multiarch

To build binaries of different architectures can also use [Multiarch](https://wiki.debian.org/Multiarch)

```typescript
const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      token: token,
      configuration: {
        docker: {
          privileged: true,
        },
      },
    },
  ],
});
```

Configure your [.gitlab-ci.yml](https://docs.gitlab.com/ee/ci/yaml/) file

```yaml
build:
  image: multiarch/debian-debootstrap:armhf-buster
  services:
    - docker:stable-dind
    - name: multiarch/qemu-user-static:register
      command:
        - "--reset"
  script:
    - make build
```

See [multiarch/qemu-user-static](https://hub.docker.com/r/multiarch/qemu-user-static)

### Running on AWS Graviton

To run your jobs on [AWS Graviton](https://aws.amazon.com/ec2/graviton/) you have to provide an AMI for arm64 architecture.

```typescript
const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      token: token,
      configuration: {
        instanceType: InstanceType.of(InstanceClass.M6G, InstanceSize.LARGE),
        machineImage: MachineImage.genericLinux({
          [this.region]: new LookupMachineImage({
            name: "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-*-server-*",
            owners: ["099720109477"],
            filters: {
              architecture: [InstanceArchitecture.ARM_64],
              "image-type": ["machine"],
              state: ["available"],
              "root-device-type": ["ebs"],
              "virtualization-type": ["hvm"],
            },
          }).getImage(this).imageId,
        }),
      },
    },
  ],
});
```

See [Ubuntu Amazon EC2 AMI Locator](https://cloud-images.ubuntu.com/locator/ec2/)

### Custom runner's role

To deploy from within your GitLab Runner Instances, you may pass a Role with the IAM Policies attached.

```typescript
const role = new Role(this, "RunnersRole", {
  assumedBy: new ServicePrincipal("ec2.amazonaws.com", {}),
  inlinePolicies: {},
});
const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      role: role,
      token: token,
      configuration: {
        // optionally configure your runner
      },
    },
  ],
});
```

See [example](https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example/blob/main/src/runner-role.ts),
[GitlabRunnerAutoscalingProps](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps)

### Vpc

If no existing Vpc is passed, a cheap [VPC](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ec2.Vpc.html) with a NatInstance (t3.nano) and a single AZ will be created.

```typescript
const natInstanceProvider = aws_ec2.NatProvider.instance({
  instanceType: aws_ec2.InstanceType.of(InstanceClass.T3, InstanceSize.NANO), // using a cheaper gateway (not scalable)
});
const vpc = new Vpc(this, "Vpc", {
  // Your custom vpc, i.e.:
  natGatewayProvider: natInstanceProvider,
  maxAzs: 1,
});

const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      token: token,
      configuration: {
        // optionally configure your runner
      },
    },
  ],
  network: { vpc: vpc },
});
```

See [example](https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example/blob/main/src/vpc.ts),
[GitlabRunnerAutoscalingProps](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps)

### Zero config

Deploys the [Autoscaling GitLab Runner on AWS EC2](https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/) with the default settings mentioned above.

Happy with the presets?

```typescript
const token = StringParameter.fromStringParameterAttributes(stack, "Token", {
  parameterName: "/gitlab-runner/token",
});

new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      token: token,
      configuration: {
        // optionally configure your runner
      },
    },
  ],
});
```

See [example](https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example/blob/main/src/zero-config.ts),
[GitlabRunnerAutoscalingProps](https://github.com/pepperize/cdk-autoscaling-gitlab-runner/blob/main/API.md#@pepperize/cdk-autoscaling-gitlab-runner.GitlabRunnerAutoscalingProps)

### ECR Credentials Helper

By default, the GitLab [amzonec2 driver](https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/blob/main/drivers/amazonec2/amazonec2.go) will be configured to install the
[amazon-ecr-credential-helper](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html#registry-auth-credential-helper)
on the runner's instances.

To configure, override the default job runners environment:

```typescript
new GitlabRunnerAutoscaling(this, "Runner", {
  runners: [
    {
      // ...
      environment: [
        "DOCKER_DRIVER=overlay2",
        "DOCKER_TLS_CERTDIR=/certs",
        'DOCKER_AUTH_CONFIG={"credHelpers": { "public.ecr.aws": "ecr-login", "<aws_account_id>.dkr.ecr.<region>.amazonaws.com": "ecr-login" } }',
      ],
    },
  ],
});
```

## Projen

This project uses [projen](https://github.com/projen/projen) to maintain project configuration through code. Thus, the synthesized files with projen should never be manually edited (in fact, projen enforces that).

To modify the project setup, you should interact with rich strongly-typed
class [AwsCdkTypeScriptApp](https://github.com/projen/projen/blob/master/API.md#projen-awscdktypescriptapp) and
execute `npx projen` to update project configuration files.

> In simple words, developers can only modify `.projenrc.js` file for configuration/maintenance and files under `/src` directory for development.

See also [Create and Publish CDK Constructs Using projen and jsii](https://github.com/seeebiii/projen-test).
