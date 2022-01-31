import { App, Duration, Stack } from "aws-cdk-lib";
import { Capture, Template } from "aws-cdk-lib/assertions";
import { Cache as CacheConstruct, CacheProps as CacheConstructProps } from "../../src/runner/cache";

const stackProps = {
  env: {
    account: "123456789012",
    region: "us-east-1",
  },
};

describe("Cache", () => {
  it("Should set ExpirationInDays to 0", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "a-very-very-long-stack-name", stackProps);
    const props: CacheConstructProps = {
      bucketName: "bucket",
      expiration: Duration.days(0),
    };
    new CacheConstruct(stack, "cache", props);

    // When
    const template = Template.fromStack(stack);

    // Then
    template.hasResourceProperties("AWS::S3::Bucket", {
      LifecycleConfiguration: {
        Rules: [
          {
            ExpirationInDays: 0,
            Status: "Disabled",
          },
        ],
      },
    });
    expect(template).toMatchSnapshot();
  });

  it("Should substring last 63 characters of bucket name", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "a-very-very-long-stack-name", stackProps);
    const props: CacheConstructProps = {
      bucketName: "and-a-very-very-long-bucket-name",
      expiration: Duration.days(0),
    };
    new CacheConstruct(stack, "cache", props);

    // When
    const template = Template.fromStack(stack);

    // Then
    template.hasResourceProperties("AWS::S3::Bucket", {
      BucketName: "ck-name-and-a-very-very-long-bucket-name-123456789012-us-east-1",
    });
    expect(template).toMatchSnapshot();
  });

  it("Should set ExpirationInDays to default", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "stack", stackProps);
    const props: CacheConstructProps = {
      bucketName: "bucket",
    };
    new CacheConstruct(stack, "cache", props);

    // When
    const template = Template.fromStack(stack);

    // Then
    template.hasResourceProperties("AWS::S3::Bucket", {
      LifecycleConfiguration: {
        Rules: [
          {
            ExpirationInDays: 30,
            Status: "Enabled",
          },
        ],
      },
    });
    expect(template).toMatchSnapshot();
  });

  it("Should set ExpirationInDays to 1", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "stack", stackProps);
    const props: CacheConstructProps = {
      bucketName: "bucket",
      expiration: Duration.days(1),
    };
    new CacheConstruct(stack, "cache", props);

    // When
    const template = Template.fromStack(stack);
    const capture = new Capture();
    template.hasResourceProperties("AWS::S3::Bucket", {
      LifecycleConfiguration: capture,
    });

    // Then
    expect(capture.asObject()).toEqual({
      Rules: [
        {
          ExpirationInDays: 1,
          Status: "Enabled",
        },
      ],
    });
    expect(template).toMatchSnapshot();
  });
});
