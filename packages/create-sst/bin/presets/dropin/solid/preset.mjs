import { append, extract, install, patch } from "create-sst";

export default [
	extract(),
	install({
		packages: [
			"sst@^2",
			"aws-cdk-lib@2.161.1",
			"constructs@10.3.0",
			"solid-start-sst",
		],
		dev: true,
	}),
	patch({
		file: "package.json",
		operations: [
			{ op: "add", path: "/scripts/sst:deploy", value: "sst deploy" },
			{ op: "add", path: "/scripts/sst:dev", value: "sst dev" },
			{ op: "add", path: "/scripts/dev", value: "sst bind solid-start dev" },
		],
	}),
	append({
		file: ".gitignore",
		string: ["", "", "# sst", ".sst"].join("\n"),
	}),
];
