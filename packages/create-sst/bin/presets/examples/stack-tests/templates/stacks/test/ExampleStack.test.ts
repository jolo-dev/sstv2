import { Template } from "aws-cdk-lib/assertions";
import { App, getStack } from "sst/constructs";
import { initProject } from "sst/project.js";
import { test } from "vitest";
import { ExampleStack } from "../ExampleStack";

test("Test timeout", async () => {
	await initProject({ stage: "prod" });
	const app = new App({ stage: "prod", mode: "deploy" });
	app.stack(ExampleStack);
	const template = Template.fromStack(getStack(ExampleStack));
	template.hasResourceProperties("AWS::Lambda::Function", {
		Timeout: 20,
	});
});
