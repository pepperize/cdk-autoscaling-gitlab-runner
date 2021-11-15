import { RunnerConfiguration, toToml } from "../../src/runner/configuration";

test("configuration", () => {
  const configuration: RunnerConfiguration = {};

  const toml = toToml(configuration);

  expect(toml).toMatchSnapshot();
});
