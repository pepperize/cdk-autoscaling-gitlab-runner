import { AwsCdkConstructLibrary } from "@pepperize/projen-awscdk-construct";
import { awscdk, javascript } from "projen";

const project = new AwsCdkConstructLibrary({
  author: "Patrick Florek",
  authorAddress: "patrick.florek@gmail.com",
  repositoryUrl: "https://github.com/pepperize/cdk-autoscaling-gitlab-runner.git",
  packageManager: javascript.NodePackageManager.YARN,
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

  cdkVersion: "2.8.0",
  cdkVersionPinning: false,
  deps: ["@iarna/toml", "pascal-case", "param-case", "snake-case"],
  devDeps: ["@pepperize/projen-awscdk-construct"],
  peerDeps: ["@pepperize/cdk-private-bucket", "@pepperize/cdk-security-group@^v0.0.439", "@pepperize/cdk-vpc"],
  bundledDeps: ["@iarna/toml", "pascal-case", "param-case", "snake-case"],

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
    mavenEndpoint: "https://s01.oss.sonatype.org",
    mavenGroupId: "com.pepperize",
    mavenArtifactId: "cdk-autoscaling-gitlab-runner",
    javaPackage: "com.pepperize.cdk.autoscaling_gitlab_runner",
  },

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_16_X,
  },
});

project.synth();
