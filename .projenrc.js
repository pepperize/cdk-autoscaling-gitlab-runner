const { NodePackageManager, AwsCdkConstructLibrary, JsonFile, NpmAccess } = require("projen");

const project = new AwsCdkConstructLibrary({
  authorName: "Ivan Ovdiienko",
  authorAddress: "ivan.ovdiienko@pepperize.com",
  authorOrganization: true,
  copyrightOwner: "Pepperize UG (haftungsbeschränkt)",
  license: "MIT",
  cdkVersion: "1.134.0",
  cdkVersionPinning: false,
  defaultReleaseBranch: "main",
  name: "@pepperize/cdk-autoscaling-gitlab-runner",
  npmAccess: NpmAccess.PUBLIC,
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
  repositoryUrl: "https://github.com/pepperize/cdk-autoscaling-gitlab-runner.git",
  packageManager: NodePackageManager.NPM,
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
  // cdkTestDependencies: undefined,  /* AWS CDK modules required for testing. */
  // description: undefined,          /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                     /* Build dependencies for this module. */
  // packageName: undefined,          /* The "name" in package.json. */

  depsUpgradeOptions: {
    workflowOptions: {
      secret: "PROJEN_GITHUB_TOKEN",
    },
  },

  release: {
    releaseEveryCommit: true,
  },
  releaseToNpm: false,
  // publishToNuget: {
  //   dotNetNamespace: "Organization.Namespace",
  //   packageId: "Package.Name",
  // },
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

project.setScript("preinstall", "npx only-allow npm");
project.setScript("format", "prettier --write 'src/**/*.ts' test/**/*.ts '.projenrc.js' 'README.md'");

new JsonFile(project, ".prettierrc", {
  obj: {
    printWidth: 120,
  },
  marker: false,
});

project.synth();
