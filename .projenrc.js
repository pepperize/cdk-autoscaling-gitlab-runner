const {
  NodePackageManager,
  NodePackageOptions,
  AwsCdkConstructLibrary,
  JsonFile,
  NpmAccess,
  AwsCdkTypeScriptApp,
} = require("projen");

/**
 * @type NodePackageOptions
 */
const nodePackageOptions = {
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

  authorName: "Ivan Ovdiienko",
  authorAddress: "ivan.ovdiienko@pepperize.com",
  authorOrganization: true,
  copyrightOwner: "Pepperize UG (haftungsbeschränkt)",
  license: "MIT",

  npmAccess: NpmAccess.PUBLIC,
  repositoryUrl: "https://github.com/pepperize/cdk-autoscaling-gitlab-runner.git",
  packageManager: NodePackageManager.NPM,
};

const project = new AwsCdkConstructLibrary({
  ...nodePackageOptions,
  name: "@pepperize-testing/cdk-autoscaling-gitlab-runner",
  description: "AWS CDK GitLab Runner autoscaling on EC2 instances using docker+machine executor.",

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

  depsUpgradeOptions: {
    workflowOptions: {
      secret: "PROJEN_GITHUB_TOKEN",
    },
  },

  defaultReleaseBranch: "main",
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
    module: "pepperize_cdk_autoscaling_gitlab-runner",
  },
  // publishToMaven: {
  //   javaPackage: "your_java_package",
  //   mavenGroupId: "your_package_group_id",
  //   mavenArtifactId: "your_package_target_id",
  // },

  eslint: true,
  eslintOptions: {
    prettier: true,
  },

  gitignore: [".idea"],
});

project.addPackageIgnore("example/");

project.setScript(
  "format",
  "prettier --write '{,example/}src/**/*.ts' '{,example/}test/**/*.ts' '.projenrc.js' 'README.md'"
);

new JsonFile(project, ".prettierrc", {
  obj: {
    printWidth: 120,
  },
  marker: false,
});

project.synth();

const example = new AwsCdkTypeScriptApp({
  ...nodePackageOptions,
  parent: project,
  outdir: "example",

  name: "@pepperize/cdk-autoscaling-gitlab-runner-example",
  cdkVersion: "1.134.0",
  defaultReleaseBranch: "main",

  cdkDependencies: [
    "@aws-cdk/aws-s3",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-iam",
  ] /* Which AWS CDK modules (those that start with "@aws-cdk/") this app uses. */,
  deps: ["@pepperize-testing/cdk-autoscaling-gitlab-runner"] /* Runtime dependencies of this module. */,
  // description: undefined,      /* The description is just a string that helps people understand the purpose of the package. */
  cdkTestDependencies: ["@aws-cdk/assertions"],
  // packageName: undefined,      /* The "name" in package.json. */
  // release: undefined,          /* Add release management to this project. */

  eslint: true,
  eslintOptions: {
    prettier: true,
  },

  gitignore: ["README.md"],
});

example.setScript("format", "prettier --write 'src/**/*.ts' test/**/*.ts '.projenrc.js' 'README.md'");

new JsonFile(example, ".prettierrc", {
  obj: {
    printWidth: 120,
  },
  marker: false,
});

example.synth();
