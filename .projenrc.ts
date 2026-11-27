import { AwsCdkConstructLibrary } from "@pepperize/projen-awscdk-construct";
import { awscdk, javascript } from "projen";

const project = new AwsCdkConstructLibrary({
  author: "Patrick Florek",
  authorAddress: "patrick.florek@gmail.com",
  repositoryUrl: "https://github.com/pepperize/cdk-autoscaling-gitlab-runner.git",
  name: "@pepperize/cdk-autoscaling-gitlab-runner",
  description: "AWS CDK GitLab Runner autoscaling on EC2 instances using docker+machine executor.",
  keywords: [
    "AWS",
    "CDK",
    "GitLab",
    "Runner",
    "Autoscaling",
    "EC2",
    "Spot Instances",
    "Docker Machine",
    "Executor",
    "Docker in Docker",
    "S3",
    "Shared Cache",
    "Deployment",
    "Utilities",
    "Graviton",
  ],

  projenrcTs: true,
  minNodeVersion: "22.13.0",
  workflowNodeVersion: "24.x",
  jestOptions: {
    jestVersion: "^30",
  },
  packageManager: javascript.NodePackageManager.YARN_CLASSIC,

  cdkVersion: "2.278.0",
  cdkVersionPinning: false,
  jsiiVersion: "~6.0.0",
  typescriptVersion: "~6.0",
  deps: ["@iarna/toml", "pascal-case@^3", "param-case@^3", "snake-case@^3"],
  devDeps: ["@pepperize/projen-awscdk-construct@~0.1.2", "@types/node@^22"],
  peerDeps: [
    "@pepperize/cdk-private-bucket@^0.0.599",
    "@pepperize/cdk-security-group@^0.0.662",
    "@pepperize/cdk-vpc@^0.0.1165",
  ],
  bundledDeps: ["@iarna/toml", "pascal-case@^3", "param-case@^3", "snake-case@^3"],

  defaultReleaseBranch: "main",
  releaseToNpm: true,
  publishToNuget: {
    dotNetNamespace: "Pepperize.CDK",
    packageId: "Pepperize.CDK.AutoscalingGitlabRunner",
  },
  publishToPypi: {
    distName: "pepperize.cdk-autoscaling-gitlab-runner",
    module: "pepperize_cdk_autoscaling_gitlab_runner",
  },
  publishToMaven: {
    mavenGroupId: "com.pepperize",
    mavenArtifactId: "cdk-autoscaling-gitlab-runner",
    javaPackage: "com.pepperize.cdk.autoscaling_gitlab_runner",
  },

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_26_X,
  },
});

project.synth();
