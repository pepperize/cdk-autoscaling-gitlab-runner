import { App, Duration, Stack } from "@aws-cdk/core";
import {
  Cache as CacheConstruct,
  CacheProps as CacheConstructProps,
} from "../../src/runner/cache";

const mockApp = new App();
const mockStack = new Stack(mockApp, "test-stack", {
  env: {
    account: "0",
    region: "us-east-1",
  },
});

test("cache", () => {
  const props: CacheConstructProps = {
    bucketName: "test",
    expiration: Duration.days(0),
  };
  const cache = new CacheConstruct(mockStack, "test", props);

  expect(cache.expiration.toDays()).toBe(Duration.days(0).toDays());
});
