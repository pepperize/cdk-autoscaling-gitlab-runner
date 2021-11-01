const {
  AwsCdkConstructLibrary,
  NodePackageManager,
  AwsCdkTypeScriptApp,
} = require("projen");

const project = new AwsCdkTypeScriptApp({
  authorName: "Ivan Ovdiienko",
  authorAddress: "ivan.ovdiienko@pepperize.com",
  authorOrganization: "Pepperize",
  cdkVersion: "1.128.0",
  cdkVersionPinning: true,
  defaultReleaseBranch: "main",
  name: "cdk-gitlab-runner",
  repositoryUrl: "https://github.com/pepperize/cdk-gitlab-runner.git",
  packageManager: NodePackageManager.NPM,
  cdkDependencies: [
    "@aws-cdk/aws-s3",
    "@aws-cdk/aws-s3-deployment",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-autoscaling",
  ],
  // deps: ["package-name", ...]
  // cdkTestDependencies: undefined,  /* AWS CDK modules required for testing. */
  // description: undefined,          /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                     /* Build dependencies for this module. */
  // packageName: undefined,          /* The "name" in package.json. */
  release: {
    releaseEveryCommit: true,
  },
  releaseToNpm: true,
  a: {
    distTag: "latest",
    registry: "registry.npmjs.org",
  },
  publishToNuget: {
    dotNetNamespace: "Organization.Namespace",
    packageId: "Package.Name",
  },
  publishToPypi: {
    distName: "<distribution-name>",
    module: "<module_name>",
  },
  publishToMaven: {
    javaPackage: "<your_java_package>",
    mavenGroupId: "<your_package_group_id",
    mavenArtifactId: "<your_package_target_id>",
  },
  publishToGo: {
    moduleName: "github.com/owner/repo/subdir",
  },
  eslint: true,
  eslintOptions: {
    prettier: true,
  },
});
project.setScript(
  "format",
  "prettier --write 'src/*.ts' '.projenrc.js' 'README.md'"
);
project.synth();
