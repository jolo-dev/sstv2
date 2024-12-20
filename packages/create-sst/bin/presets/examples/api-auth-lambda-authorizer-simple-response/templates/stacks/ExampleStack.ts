import { Api, Function, type StackContext } from "sst/constructs";

export function ExampleStack({ stack }: StackContext) {
	// Create Api
	const api = new Api(stack, "Api", {
		authorizers: {
			lambda: {
				type: "lambda",
				responseTypes: ["simple"],
				function: new Function(stack, "Authorizer", {
					handler: "packages/functions/src/authorizer.main",
				}),
			},
		},
		defaults: {
			authorizer: "lambda",
		},
		routes: {
			"GET /private": "packages/functions/src/private.main",
			"GET /public": {
				function: "packages/functions/src/public.main",
				authorizer: "none",
			},
		},
	});

	// Show the API endpoint and other info in the output
	stack.addOutputs({
		ApiEndpoint: api.url,
	});
}
