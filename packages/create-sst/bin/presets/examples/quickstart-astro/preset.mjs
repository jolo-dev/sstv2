import { cmd, extend, extract, install, patch, str_replace } from "create-sst";
export default [
	extract(),
	install({
		packages: [
			"sst@^2",
			"astro-sst",
			"aws-cdk-lib@2.91.0",
			"constructs@10.2.69",
		],
		dev: true,
	}),
	install({
		packages: ["@aws-sdk/client-s3", "@aws-sdk/s3-request-presigner", "astro"],
	}),
];
