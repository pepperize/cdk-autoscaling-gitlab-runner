![GitHub](https://img.shields.io/github/license/pepperize/cdk-autoscaling-gitlab-runner?style=flat-square)
![npm (scoped)](https://img.shields.io/npm/v/@pepperize-testing/cdk-autoscaling-gitlab-runner?style=flat-square)
![PyPI](https://img.shields.io/pypi/v/pepperize.cdk-autoscaling-gitlab-runner?style=flat-square)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/pepperize/cdk-autoscaling-gitlab-runner/build/main?label=build&style=flat-square)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/pepperize/cdk-autoscaling-gitlab-runner/release/main?label=release&style=flat-square)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/pepperize/cdk-autoscaling-gitlab-runner?sort=semver&style=flat-square)

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

_Note: it's a really simple and short README. Only basic tips are covered. Feel free to improve it._

## Quickstart

1. **Create a new AWS CDK App** in TypeScript with [projen](https://github.com/projen/projen)

   ```shell
   mkdir gitlab-runner
   cd gitlab-runner
   git init
   npx projen new awscdk-app-ts
   ```

2. **Configure your project in `.projenrc.js`**

   - Add `deps: ["@pepperize-testing/cdk-autoscaling-gitlab-runner"],`

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

6. **Add to your `main.ts`**

   ```typescript
   import { Vpc } from "@aws-cdk/aws-ec2";
   import { App, Stack } from "@aws-cdk/core";
   import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";

   const app = new App();
   const stack = new Stack(app, "GitLabRunnerStack");
   const vpc = Vpc.fromLookup(app, "ExistingVpc", {
     vpcId: "<your vpc id>",
   });
   new GitlabRunnerAutoscaling(stack, "GitlabRunner", {
     gitlabToken: "<your gitlab runner auth token>",
     network: {
       vpc,
     },
   });
   ```

7. **Create service linked role**

   _(If requesting spot instances, default: true)_

   ```sh
   aws iam create-service-linked-role --aws-service-name spot.amazonaws.com
   ```

8. **Configure the AWS CLI**

   - [AWSume](https://awsu.me/)
   - [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
   - [AWS Single Sign-On](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html)

9. **Deploy the GitLab Runner**

   ```shell
   npm run deploy
   ```

## Development

### Quick start

Run:

```
npm install
```

```
npx projen
```

### Maintenance (Projen)

This project uses [projen](https://github.com/projen/projen) to maintain project configuration through code. Thus, the synthesized files with projen should never be manually edited (in fact, projen enforces that).

To modify the project setup, you should interact with rich strongly-typed
class [AwsCdkTypeScriptApp](https://github.com/projen/projen/blob/master/API.md#projen-awscdktypescriptapp) and
execute `npx projen` to update project configuration files.

> In simple words, developers can only modify `.projenrc.js` file for configuration/maintenance and files under `/src` directory for development.

### Development

The current development branch is `main`. The dev environment is `production`. The commit convention is [Angular](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

## ROLLBACK CAUTION

Rollback will **delete all resources** provisioned with this app, **except**:

- KMS key.

These resources should be deleted **manually**
