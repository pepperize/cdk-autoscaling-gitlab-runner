*Note: it's a really simple and short README. Only basic tips are covered. Feel free to improve it.*
# Prerequisites:

- **[WebStorm](https://www.jetbrains.com/phpstorm/)**: ^2021.2 or any other IDE for TypeScript development,
- **[Node.js](https://nodejs.org/download/release/v14.6.0/)**: ^16.6.2,
- **[npm](https://www.npmjs.com/package/npm/v/6.14.6)**: ^7.20.3 (Comes bundled with Node.js),
- **[awscli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)** ^1.20.31.
# Quick start

Run:

```
npm install
```

```
npx projen
```

# Maintenance (Projen)

This project uses [projen](https://github.com/projen/projen) to maintain project configuration through code. Thus, the synthesized files with projen should never be manually edited (in fact, projen enforces that).

To modify the project setup, you should interact with rich strongly-typed
class [AwsCdkTypeScriptApp](https://github.com/projen/projen/blob/master/API.md#projen-awscdktypescriptapp) and
execute `npx projen` to update project configuration files.

> In simple words, developers can only modify `.projenrc.js` file for configuration/maintenance and files under `/src` directory for development.


# Development

The current development branch is `master`. The dev environment is `production`. The commit convention is [Angular](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

# Philosophy

It will be a useful and reusable **gitlab runner** CDK Construct. We'll make it available to the public across diffent package registries and different programming languages. 