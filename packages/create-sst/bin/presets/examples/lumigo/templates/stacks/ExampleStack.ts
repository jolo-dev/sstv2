import { Tags } from "aws-cdk-lib";
import { Api, type StackContext } from "sst/constructs";

export function ExampleStack({ stack, app }: StackContext) {
	// Create a HTTP API
	const api = new Api(stack, "Api", {
		routes: {
			"GET /": "packages/functions/src/lambda.handler",
		},
	});

	// Enable auto trace only in prod
	if (!app.local)
		Tags.of(api.getFunction("GET /")).add("lumigo:auto-trace", "true");

	// Show the endpoint in the output
	stack.addOutputs({
		ApiEndpoint: api.url,
	});
}
