import { StackProps } from "@aws-cdk/core";

export interface RunnerStackProps extends StackProps {
  readonly gitlabToken: string;
}
