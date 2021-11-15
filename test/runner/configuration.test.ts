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
      },
    ],
  };

  const toml = toToml(config);

  expect(toml).toMatchSnapshot();
});
