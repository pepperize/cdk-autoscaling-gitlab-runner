import {
  Configuration,
  defaultConfiguration,
  GlobalConfiguration,
  MachineOptions,
} from "../../src/runner-configuration";

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
            AccessKey: "ASIAZJBNZOWZ2QXIG7EB",
          },
        },
        machine: {
          ...defaultConfiguration.runners[0].machine,
          MachineOptions: new MachineOptions({
            "instance-type": "t3.micro",
            ami: "ami-083654bd07b5da81d",
            region: "us-east-1",
            "vpc-id": "vpc-0da907b688369469e",
            zone: "a",
            "subnet-id": "subnet-0da907b688369469e",
            "security-group": "RunnersSecurityGroup",
            "use-private-address": true,
            "iam-instance-profile": "RunnersInstanceProfile",
            "request-spot-instance": true,
            "block-duration-minutes": 60,
            "spot-price": 0.03,
          }).toArray(),
        },
      },
    ],
  };

  const toml = new Configuration(config).toToml();

  expect(toml).toMatchSnapshot();
});
