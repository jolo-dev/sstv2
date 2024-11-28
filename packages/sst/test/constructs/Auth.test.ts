import { describe, expect, test } from "vitest";
import { Api, App, Auth, Stack } from "../../dist/constructs";
import { createApp, hasResource } from "./helper";

describe("auth", async () => {
	const stack = new Stack(await createApp(), "stack");
	const auth = new Auth(stack, "auth", {
		authenticator: "test/lambda.handler",
	});

	test("adds route", async () => {
		const stack = new Stack(await createApp(), "stack");
		const api = new Api(stack, "api", {});
		auth.attach(stack, {
			api,
		});
		hasResource(stack, "AWS::ApiGatewayV2::Route", {
			RouteKey: "ANY /auth/{proxy+}",
		});
	});
});
