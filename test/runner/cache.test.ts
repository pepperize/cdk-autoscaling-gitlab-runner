import { App, Duration, Stack } from "@aws-cdk/core";
import {
  Cache as CacheConstruct,
  CacheProps as CacheConstructProps,
} from "../../src/runner/cache";

const mockApp = new App();
const stackProps = {
  env: {
    account: "0",
    region: "us-east-1",
  },
};

test("cache-expiration-set-to-0", () => {
  const mockStack = new Stack(mockApp, "test-stack-0", stackProps);
  const props: CacheConstructProps = {
    bucketName: "test-0",
    expiration: Duration.days(0),
  };
  const cache = new CacheConstruct(mockStack, "test-0", props);

  expect(cache.expiration.toDays()).toBe(Duration.days(0).toDays());
  expect(cache.lifeCycleRuleEnabled).toBe(false);
});

test("cache-expiration-not-set-and-becomes-default", () => {
  const mockStack = new Stack(mockApp, "test-stack-undefined", stackProps);
  const props: CacheConstructProps = {
    bucketName: "test-undefined",
  };
  const cache = new CacheConstruct(mockStack, "test-undefined", props);

  expect(cache.expiration.toDays()).toBe(Duration.days(30).toDays());
  expect(cache.lifeCycleRuleEnabled).toBe(true);
});

test("cache-expiration-set-to-value-1", () => {
  const mockStack = new Stack(mockApp, "test-stack-set-to-value-1", stackProps);
  const props: CacheConstructProps = {
    bucketName: "test-set-to-value-1",
    expiration: Duration.days(1),
  };
  const cache = new CacheConstruct(mockStack, "test-set-to-value-1", props);

  expect(cache.expiration.toDays()).toBe(Duration.days(1).toDays());
  expect(cache.lifeCycleRuleEnabled).toBe(true);
});
