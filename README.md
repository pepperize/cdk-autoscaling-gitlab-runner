![GitHub](https://img.shields.io/github/license/pepperize/cdk-autoscaling-gitlab-runner?style=flat-square)

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/pepperize/cdk-autoscaling-gitlab-runner/release?style=flat-square)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/pepperize/cdk-autoscaling-gitlab-runner/release/master?label=release&style=flat-square)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/pepperize/cdk-autoscaling-gitlab-runner?sort=semver&style=flat-square)

# AWS CDK GitLab Runner autoscaling on EC2

This project provides a CDK construct to [execute jobs on auto-scaled EC2 instances](https://docs.gitlab.com/runner/configuration/runner_autoscale_aws/index.html) using the [Docker Machine](https://docs.gitlab.com/runner/executors/docker_machine.html) executor.

_Note: it's a really simple and short README. Only basic tips are covered. Feel free to improve it._

## Development

### Prerequisites:

- **[WebStorm](https://www.jetbrains.com/phpstorm/)**: ^2021.2 or any other IDE for TypeScript development,
- **[Node.js](https://nodejs.org/download/release/v14.6.0/)**: ^16.6.2,
- **[npm](https://www.npmjs.com/package/npm/v/6.14.6)**: ^7.20.3 (Comes bundled with Node.js),
- **[awscli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)** ^1.20.31,
- **[dotnet](https://docs.microsoft.com/en-us/dotnet/core/install/)** ^6.0.100,
- **[OpenJDK](https://jdk.java.net/)** ^11,
- **[Apache Maven](https://jdk.java.net/)** ^3.8.4,

### Quick start

Run:

```
npm install
```

```
npx projen
```

### Deploy

1. **Register a new runner**

   https://docs.gitlab.com/ee/api/runners.html#register-a-new-runner

1. **Get new runner token from register token**

   ```sh
   curl --request POST "https://gitlab.com/api/v4/runners" --form "token=<your register token>" --form "description=gitlab-runner-pepperize" --form "tag_list=<environment name>"
   ```

1. **Configure aws credentials**

   - Go to [SSO Starting Page](https://pepperize.awsapps.com/),
   - Select the proper account and follow "Command line or programmatic access" instructions,
   - You may need to reload or open the fresh terminal instance so the environment variables get updated.

1. **AWS CDK deploy**

   ```sh
   npm run deploy
   ```

1. **Create service linked role**

   _If using spot instances_

   ```sh
   aws iam create-service-linked-role --aws-service-name spot.amazonaws.com
   ```

### Maintenance (Projen)

This project uses [projen](https://github.com/projen/projen) to maintain project configuration through code. Thus, the synthesized files with projen should never be manually edited (in fact, projen enforces that).

To modify the project setup, you should interact with rich strongly-typed
class [AwsCdkTypeScriptApp](https://github.com/projen/projen/blob/master/API.md#projen-awscdktypescriptapp) and
execute `npx projen` to update project configuration files.

> In simple words, developers can only modify `.projenrc.js` file for configuration/maintenance and files under `/src` directory for development.

### Development

The current development branch is `master`. The dev environment is `production`. The commit convention is [Angular](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

## Philosophy

It will be a useful and reusable **gitlab runner** CDK Construct. We'll make it available to the public across diffent package registries and different programming languages.

## ROLLBACK CAUTION

Rollback will **delete all resources** provisioned with this app, **except**:

- S3 bucket,
- KMS key.

These resources should be deleted **manually**
