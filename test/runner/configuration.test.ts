import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
} from "@aws-cdk/aws-ec2";
import { CfnInstanceProfile } from "@aws-cdk/aws-iam";
import { Bucket } from "@aws-cdk/aws-s3";
import { App, Stack } from "@aws-cdk/core";
import { Configuration } from "../../src/runner/configuration";
import { defaultConfiguration } from "../../src/runner/configuration.default";
import {
  GlobalConfiguration,
  MachineOptions,
} from "../../src/runner/configuration.types";

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

test("configuration-az-from-props", () => {
  const AVAILABILITY_ZONE = "us-east-1a";
  const mockApp = new App();
  const stackProps = {
    env: {
      account: "0",
      region: "us-east-1",
    },
  };
  const mockStack = new Stack(
    mockApp,
    "test-stack-configuration-az-from-props",
    stackProps
  );

  const config = Configuration.fromProps({
    scope: mockStack,
    gitlabToken: "",
    cache: new Bucket(mockStack, "mock-bucket-configuration-from-props"),
    vpc: {
      vpcId: "0",
      subnetId: "0",
      availabilityZone: AVAILABILITY_ZONE,
    },
    runner: {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.NANO),
      machineImage: MachineImage.latestAmazonLinux({}),
      securityGroupName: "",
      instanceProfile: new CfnInstanceProfile(
        mockStack,
        "mock-cfnip-configuration-from-props",
        {
          roles: [],
        }
      ),
    },
    spot: {
      requestSpotInstance: true,
      spotPrice: 0.03,
    },
  });

  expect(
    // @ts-ignore
    config.configuration.runners[0].machine.MachineOptions.find(
      (entry: string) => entry.includes("amazonec2-zone=")
    )
  ).toBe("amazonec2-zone=a");
});
