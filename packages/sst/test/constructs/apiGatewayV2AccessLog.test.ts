import { expect, test } from "vitest";
import { cleanupLogGroupName } from "../../dist/constructs/util/apiGatewayV2AccessLog";

test("default", async () => {
	expect(cleanupLogGroupName("/aws/$default/$abc")).toEqual("/aws/default/abc");
});
