const { awscdk, javascript } = require("projen");

const project = new awscdk.AwsCdkConstructLibrary({
  authorName: "Ivan Ovdiienko",
  authorAddress: "ivan.ovdiienko@pepperize.com",
  authorOrganization: true,
  copyrightOwner: "Pepperize UG (haftungsbeschränkt)",
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
  ],

  cdkVersion: "1.134.0",
  cdkVersionPinning: false,
  cdkDependencies: [
    "@aws-cdk/core",
    "@aws-cdk/aws-s3",
    "@aws-cdk/aws-s3-deployment",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-autoscaling",
  ],
  deps: ["@iarna/toml", "pascal-case", "param-case", "snake-case"],
  bundledDeps: ["@iarna/toml", "pascal-case", "param-case", "snake-case"],
  cdkTestDependencies: ["@aws-cdk/assertions"] /* AWS CDK modules required for testing. */,
  // devDeps: [],                     /* Build dependencies for this module. */
  // packageName: undefined,          /* The "name" in package.json. */

  autoApproveUpgrades: true,
  autoApproveOptions: { allowedUsernames: ["pflorek"], secret: "GITHUB_TOKEN" },
  depsUpgradeOptions: {
    workflowOptions: {
      secret: "PROJEN_GITHUB_TOKEN",
    },
  },

  defaultReleaseBranch: "main",
  npmAccess: javascript.NpmAccess.PUBLIC,
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

  eslint: true,
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
    },
  },

  gitignore: [".idea"],
});

project.setScript("format", "prettier --write src/**/*.ts test/**/*.ts .projenrc.js README.md");

project.jest.addTestMatch("**/?(*.)@(spec|test).[tj]s?(x)"); // fix for windows

project.synth();
