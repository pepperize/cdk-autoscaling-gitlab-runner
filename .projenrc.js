const { AwsCdkConstructLibrary } = require("@pepperize/projen-awscdk-construct");
const { javascript } = require("projen");

const project = new AwsCdkConstructLibrary({
  authorName: "Patrick Florek",
  authorAddress: "patrick.florek@gmail.com",
  license: "MIT",

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

  cdkVersion: "2.8.0",
  cdkVersionPinning: false,
  deps: ["@iarna/toml", "pascal-case", "param-case", "snake-case"],
  devDeps: ["@pepperize/projen-awscdk-construct"],
  peerDeps: ["@pepperize/cdk-private-bucket", "@pepperize/cdk-security-group", "@pepperize/cdk-vpc"],
  bundledDeps: ["@iarna/toml", "pascal-case", "param-case", "snake-case"],
  testDeps: ["@aws-cdk/assertions"] /* AWS CDK modules required for testing. */,

  autoApproveUpgrades: true,
  autoApproveOptions: { allowedUsernames: ["pflorek"], secret: "GITHUB_TOKEN" },
  depsUpgradeOptions: {
    workflowOptions: {
      secret: "PROJEN_GITHUB_TOKEN",
    },
  },

  release: {
    releaseEveryCommit: true,
  },
  releaseToNpm: true,
  publishToNuget: {
    dotNetNamespace: "Pepperize.CDK",
    packageId: "Pepperize.CDK.AutoscalingGitlabRunner",
  },
  publishToPypi: {
    distName: "pepperize.cdk-autoscaling-gitlab-runner",
    module: "pepperize_cdk_autoscaling_gitlab_runner",
  },
  // publishToMaven: {
  //   javaPackage: "your_java_package",
  //   mavenGroupId: "your_package_group_id",
  //   mavenArtifactId: "your_package_target_id",
  // },
});

project.tasks.tryFind("package:python")?.prependExec("pip3 install packaging");

project.synth();
