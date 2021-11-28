import { ConfigurationMapper, ConfigurationMapperProps } from "../../src";

describe("ConfigurationMapper", () => {
  it("Should return empty map", () => {
    // Given
    const props: ConfigurationMapperProps = {
      globalConfiguration: {},
      runnerConfiguration: {},
      dockerConfiguration: {},
      machineConfiguration: {},
      autoscalingConfigurations: [],
      cacheConfiguration: {},
    };

    // When
    const mapper = ConfigurationMapper.fromProps(props);
    const result = mapper._toJsonMap();

    // Then
    expect(result).toEqual({
      runners: [
        {
          cache: { s3: {} },
          docker: {},
          machine: { MachineOptions: [], autoscaling: [] },
        },
      ],
    });
  });

  it("Should filter undefined and nullables", () => {
    // Given
    const props: ConfigurationMapperProps = {
      globalConfiguration: {
        logFormat: undefined,
      },
      runnerConfiguration: {},
      dockerConfiguration: {},
      machineConfiguration: {
        machineOptions: {
          blockDurationMinutes: undefined,
        },
      },
      autoscalingConfigurations: [],
      cacheConfiguration: {},
    };

    // When
    const mapper = ConfigurationMapper.fromProps(props);
    const result = mapper._toJsonMap();

    // Then
    expect(result).toEqual({
      runners: [
        {
          cache: { s3: {} },
          docker: {},
          machine: { MachineOptions: [], autoscaling: [] },
        },
      ],
    });
  });

  it("Should return map with defaults", () => {
    // Given
    const props: ConfigurationMapperProps = {
      globalConfiguration: {},
      runnerConfiguration: {},
      dockerConfiguration: {},
      machineConfiguration: {},
      autoscalingConfigurations: [],
      cacheConfiguration: {},
    };

    // When
    const mapper = ConfigurationMapper.withDefaults(props);
    const result = mapper._toJsonMap();

    // Then
    expect(result).toEqual({
      check_interval: 0,
      concurrent: 10,
      log_format: "runner",
      log_level: "info",
      runners: [
        {
          environment: ["DOCKER_DRIVER=overlay2", "DOCKER_TLS_CERTDIR=/certs"],
          executor: "docker+machine",
          limit: 10,
          name: "gitlab-runner",
          output_limit: 52428800,
          url: "https://gitlab.com",
          cache: { Type: "s3", Shared: true, s3: {} },
          docker: {
            tls_verify: false,
            image: "docker:19.03.5",
            privileged: true,
            cap_add: ["CAP_SYS_ADMIN"],
            wait_for_services_timeout: 300,
            disable_cache: false,
            volumes: ["/certs/client", "/cache"],
            shm_size: 0,
          },
          machine: {
            IdleCount: 0,
            IdleTime: 300,
            MaxBuilds: 20,
            MachineDriver: "amazonec2",
            MachineName: "gitlab-runner-%s",
            MachineOptions: ["amazonec2-request-spot-instance=true", "amazonec2-spot-price=0.03"],
            autoscaling: [{ Periods: ["* * 7-22 * * mon-fri *"], IdleCount: 1, IdleTime: 1800, Timezone: "Etc/UTC" }],
          },
        },
      ],
    });
  });
  it("Should map snapshot with defaults", () => {
    // Given
    const props: ConfigurationMapperProps = {
      globalConfiguration: {},
      runnerConfiguration: {
        token: "foo+bar",
      },
      dockerConfiguration: {},
      machineConfiguration: {},
      autoscalingConfigurations: [],
      cacheConfiguration: {
        s3: {
          serverAddress: "s3.amazonaws.com",
          bucketName: "gitlab-runner-cahe-bucket-test-us-east-1",
          bucketLocation: "us-east-1",
          accessKey: "AKIAIOSFODNN7EXAMPLE",
          secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        },
      },
    };

    // When
    const mapper = ConfigurationMapper.withDefaults(props);
    const result = mapper.toToml();

    // Then
    expect(result).toMatchSnapshot();
  });
});
