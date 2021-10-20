const { AwsCdkConstructLibrary, NodePackageManager } = require('projen');

const project = new AwsCdkConstructLibrary({
  author: 'Ivan Ovdiienko',
  authorAddress: 'ivan.ovdiienko@pepperize.com',
  authorOrganization: "Pepperize",
  cdkVersion: '1.128.0',
  cdkVersionPinning: true,
  defaultReleaseBranch: 'main',
  name: 'cdk-gitlab-runner',
  repositoryUrl: 'https://github.com/pepperize/cdk-gitlab-runner.git',
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
    distTag: 'latest',
    npmTokenSecret: 'NPM_TOKEN', // Default: "NPM_TOKEN" or "GITHUB_TOKEN" if registry is set to npm.pkg.github.com.
    registry: 'registry.npmjs.org',
  },
  publishToNuget: {},
  publishToPypi: {},
  publishToMaven: {},
  publishToGo: {},
});
project.synth();