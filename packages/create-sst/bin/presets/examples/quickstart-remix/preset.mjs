import { cmd, extend, extract, install, patch, str_replace } from "create-sst";
export default [
	extract(),
	install({
		packages: [
			"@remix-run/dev",
			"@remix-run/eslint-config",
			"@types/react",
			"@types/react-dom",
			"aws-cdk-lib@2.91.0",
			"constructs@10.2.69",
			"eslint@^8.57.0",
			"sst@^2",
			"typescript",
			"vite",
		],
		dev: true,
	}),
	install({
		packages: [
			"@aws-sdk/client-s3",
			"@aws-sdk/s3-request-presigner",
			"@remix-run/css-bundle",
			"@remix-run/node",
			"@remix-run/react",
			"@remix-run/serve",
			"isbot",
			"react",
			"react-dom",
		],
	}),
];
