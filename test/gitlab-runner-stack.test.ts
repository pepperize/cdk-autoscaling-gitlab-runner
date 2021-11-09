import { SynthUtils } from "@aws-cdk/assert";
import { SubnetType, Vpc } from "@aws-cdk/aws-ec2";
import { App, Stack } from "@aws-cdk/core";
import {
  GitlabRunnerStack,
  GitlabRunnerStackProps,
} from "../src/gitlab-runner-stack";

test("gitlab-runner", () => {
  const app = new App();

  const mockVpcStack = new Stack(app, "VpcStack");
  const mockVpc = Vpc.fromVpcAttributes(mockVpcStack, "MyVpc", {
    vpcId: "vpc123",
    availabilityZones: ["az1"],
    privateSubnetIds: ["priv1"],
  });
  jest.spyOn(Vpc, "fromLookup").mockImplementationOnce(() => mockVpc);

  const props: GitlabRunnerStackProps = {
    gitlabToken: "",
    vpcIdToLookUp: "-",
    vpcSubnet: { subnetType: SubnetType.PRIVATE_WITH_NAT },
  };
  const gitlabRunnerStack = new GitlabRunnerStack(app, "gitlab-runner", props);

  expect(SynthUtils.toCloudFormation(gitlabRunnerStack)).toMatchSnapshot();
});
