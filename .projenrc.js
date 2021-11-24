const { NodePackageManager, AwsCdkTypeScriptApp } = require("projen");

const project = new AwsCdkTypeScriptApp({
  authorName: "Ivan Ovdiienko",
  authorAddress: "ivan.ovdiienko@pepperize.com",
  authorOrganization: "Pepperize",
  copyrightOwner: "Pepperize UG (haftungsbeschränkt)",
  license: "MIT",
  cdkVersion: "1.132.0",
  cdkVersionPinning: true,
  defaultReleaseBranch: "main",
  name: "@pepperize/cdk-autoscaling-gitlab-runner",
  description:
    "AWS CDK GitLab Runner autoscaling on EC2 instances using docker+machine executor.",
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
  repositoryUrl:
    "https://github.com/pepperize/cdk-autoscaling-gitlab-runner.git",
  packageManager: NodePackageManager.NPM,
  cdkDependencies: [
    "@aws-cdk/aws-s3",
    "@aws-cdk/aws-s3-deployment",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-autoscaling",
  ],
  appEntrypoint: "main.ts",
  context: {
    "@aws-cdk/core:enableStackNameDuplicates": "true",
    "aws-cdk:enableDiffNoFail": "true",
    "@aws-cdk/core:stackRelativeExports": "true",
    "@aws-cdk/core:newStyleStackSynthesis": true,
  },
  deps: ["@iarna/toml"],
  // cdkTestDependencies: undefined,  /* AWS CDK modules required for testing. */
  // description: undefined,          /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                     /* Build dependencies for this module. */
  // packageName: undefined,          /* The "name" in package.json. */
  release: {
    releaseEveryCommit: true,
  },
  releaseToNpm: false,
  a: {
    distTag: "latest",
    registry: "registry.npmjs.org",
  },
  publishToNuget: {
    dotNetNamespace: "Organization.Namespace",
    packageId: "Package.Name",
  },
  publishToPypi: {
    distName: "distribution-name",
    module: "module_name",
  },
  publishToMaven: {
    javaPackage: "your_java_package",
    mavenGroupId: "your_package_group_id",
    mavenArtifactId: "your_package_target_id",
  },
  publishToGo: {
    moduleName: "github.com/owner/repo/subdir",
  },
  eslint: true,
  eslintOptions: {
    prettier: true,
  },
  gitignore: [".idea"],
});

project.setScript("preinstall", "npx only-allow npm");
project.setScript("build", "tsc");
project.setScript("watch", "tsc -w");
project.setScript("cdk", "cdk");
project.setScript(
  "bootstrap",
  "cdk bootstrap --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess"
);
project.setScript("synth", "cdk synth");
project.setScript("deploy", "cdk deploy");
project.setScript(
  "format",
  "prettier --write 'src/**/*.ts' test/**/*.ts '.projenrc.js' 'README.md'"
);

project.buildWorkflow.on({ push: {}, pullRequest: {}, workflowDispatch: {} });
project.buildTask.reset();
project.buildTask.exec("npx projen");
project.buildTask.spawn({ name: "test" });
project.buildTask.spawn({ name: "compile" });

project.synth();
