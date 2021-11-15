import { toToml } from "../../src/runner/configuration";
import { defaultConfiguration } from "../../src/runner/configuration.default";
import { GlobalConfiguration } from "../../src/runner/configuration.types";

test("configuration", () => {
  const config: GlobalConfiguration = {
    ...defaultConfiguration,
    runners: [
      {
        ...defaultConfiguration.runners[0],
        token: "foo+bar",
        cache: {
          ...defaultConfiguration.runners[0].cache,
          s3: {
            ServerAddress: "s3.amazonaws.com",
            BucketName: "gitlab-runner-cahe-bucket-test-us-east-1",
            BucketLocation: "us-east-1",
          },
        },
      },
    ],
  };

  const toml = toToml(config);

  expect(toml).toMatchSnapshot();
});
