import { IMachineImage, Instance, InstanceType, Vpc } from "@aws-cdk/aws-ec2";
import { Bucket, BucketEncryption, LifecycleRule } from "@aws-cdk/aws-s3";
import {
  BucketDeployment,
  ServerSideEncryption,
} from "@aws-cdk/aws-s3-deployment";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

export interface GitlabRunnerStackProps extends StackProps {
  instanceTypeIdentifier: string;
  vpc: Vpc;
  machineImage: IMachineImage;
  /** These props come from "Parameters:" from runner.yml CFN template */
  cacheBucketName: string;
  cacheExpirationInDays: number;
  vpcId: any; // todo: Provide some type
  availabilityZone: any; // todo: Provide some type
  subnetId: any; // todo: Provide some type
  managerImageId: any; // todo: Provide some type
  managerInstanceType: any; // todo: Provide some type
  managerKeyPair: any; // todo: Provide some type
  gitlabUrl: any; // todo: Provide some type
  gitlabToken: any; // todo: Provide some type
  gitlabRunnerInstanceType: any; // todo: Provide some type
  gitlabDockerImage: any; // todo: Provide some type
  gitlabMaxBuilds: any; // todo: Provide some type
  gitlabMaxConcurrentBuilds: any; // todo: Provide some type
  gitlabIdleCount: any; // todo: Provide some type
  gitlabIdleTime: any; // todo: Provide some type
  gitlabOffPeakTimezone: any; // todo: Provide some type
  gitlabOffPeakIdleCount: any; // todo: Provide some type
  gitlabOffPeakIdleTime: any; // todo: Provide some type
  gitlabCheckInterval: any; // todo: Provide some type
  gitlabRunnerSpotInstance: any; // todo: Provide some type
  gitlabRunnerSpotInstancePrice: any; // todo: Provide some type
}

export class GitlabRunnerStack extends Stack {
  private cacheBucketExpirationDate: Date;
  constructor(scope: Construct, id: string, props: GitlabRunnerStackProps) {
    super(scope, id, props);

    const instance = new Instance(this, "GitlabRunnerInstance", {
      instanceType: new InstanceType(props.instanceTypeIdentifier),
      vpc: props.vpc,
      machineImage: props.machineImage,
    });

    // Transformation cacheExpirationInDays --> expirationDate
    const today = new Date();
    const cacheBucketExpirationDate = new Date();
    cacheBucketExpirationDate.setDate(
      today.getDate() + props.cacheExpirationInDays
    );

    const cacheBucket = new Bucket(this, "GitlabRunnerCacheBucket", {
      bucketName: props.cacheBucketName,
      lifecycleRules: [
        {
          enabled: true,
          expirationDate: cacheBucketExpirationDate,
        },
      ],
      encryption: BucketEncryption.KMS,
      bucketKeyEnabled: true,
    });

    const cacheBucketDeployment = new BucketDeployment(
      this,
      "GitlabRunnerCacheBucketDeployment",
      {
        sources: null, // todo: configure it
        destinationBucket: cacheBucket,
        serverSideEncryption: ServerSideEncryption.AES_256,
      }
    );
  }
}
