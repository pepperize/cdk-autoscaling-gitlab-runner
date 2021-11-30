import { PolicyDocument, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { Construct, Stack } from "@aws-cdk/core";
import { GitlabRunnerAutoscaling } from "@pepperize-testing/cdk-autoscaling-gitlab-runner";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomRunnersRoleProps extends RunnerStackProps {}

export class RunnersRoleStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomRunnersRoleProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const role = new Role(this, "RunnersRole", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com", {}),
      inlinePolicies: {
        CdkDeploy: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: [
                "cloudformation:DescribeStacks",
                "cloudformation:CreateChangeSet",
                "cloudformation:DescribeChangeSet",
                "cloudformation:ExecuteChangeSet",
                "cloudformation:DescribeStackEvents",
                "cloudformation:DeleteChangeSet",
                "cloudformation:GetTemplate",
              ],
              Resource: ["*"],
            },
            {
              Effect: "Allow",
              Action: ["s3:*Object", "s3:ListBucket", "s3:GetBucketLocation"],
              Resource: ["arn:aws:s3:::cdktoolkit-*"],
            },
          ],
        }),
        CfnDeploy: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["*"],
              Resource: ["*"],
              Condition: {
                "ForAnyValue:StringEquals": {
                  "aws:CalledVia": "cloudformation.amazonaws.com",
                },
              },
            },
          ],
        }),
      },
    });

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      runners: {
        role: role,
      },
    });
  }
}
