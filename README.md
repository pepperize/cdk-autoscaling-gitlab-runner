### Maintenance (Projen)

This project uses [projen](https://github.com/projen/projen) to maintain project configuration through code. Thus, the synthesized files with projen should never be manually edited (in fact, projen enforces that).

To modify the project setup, you should interact with rich strongly-typed
class [AwsCdkTypeScriptApp](https://github.com/projen/projen/blob/master/API.md#projen-awscdktypescriptapp) and
execute `npx projen` to update project configuration files.

> In simple words, developers can only modify `.projenrc.js` file for configuration/maintenance and files under `/src` directory for development.

## Prerequisites:

- **[WebStorm](https://www.jetbrains.com/phpstorm/)**: ^2021.2 or any other IDE for TypeScript development,
- **[Node.js](https://nodejs.org/download/release/v14.6.0/)**: ^16.6.2,
- **[npm](https://www.npmjs.com/package/npm/v/6.14.6)**: ^7.20.3 (Comes bundled with Node.js),
- **[awscli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)** ^1.20.31.
# Quick start

```
npm install
```

```
npx projen
```