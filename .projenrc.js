const { AwsCdkConstructLibrary, NodePackageManager } = require("projen");

const project = new AwsCdkConstructLibrary({
  author: "Ivan Ovdiienko",
  authorAddress: "ivan.ovdiienko@pepperize.com",
  authorOrganization: "Pepperize",
  cdkVersion: "1.128.0",
  cdkVersionPinning: true,
  defaultReleaseBranch: "main",
  name: "cdk-gitlab-runner",
  repositoryUrl: "https://github.com/pepperize/cdk-gitlab-runner.git",
  packageManager: NodePackageManager.NPM,

  // cdkDependencies: undefined,      /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  // cdkTestDependencies: undefined,  /* AWS CDK modules required for testing. */
  // deps: [],                        /* Runtime dependencies of this module. */
  // description: undefined,          /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                     /* Build dependencies for this module. */
  // packageName: undefined,          /* The "name" in package.json. */
  release: {
    releaseEveryCommit: true,
  },
  releaseToNpm: {
    distTag: "latest",
    registry: "registry.npmjs.org",
  },
  publishToNuget: {
    dotNetNamespace: "",
    packageId: "",
  },
  publishToPypi: {
    distName: "",
    module: "",
  },
  publishToMaven: {
    javaPackage: "",
    mavenGroupId: "",
    mavenArtifactId: "",
  },
  publishToGo: {
    moduleName: "",
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
