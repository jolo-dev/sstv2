import { cmd, extend, extract, install, patch, str_replace } from "create-sst";
export default [
	extract(),
	install({
		packages: [
			"@aws-sdk/client-s3",
			"@aws-sdk/s3-request-presigner",
			"@fontsource/fira-mono",
			"@neoconfetti/svelte",
			"@sveltejs/adapter-auto",
			"@sveltejs/kit",
			"@types/cookie",
			"aws-cdk-lib@2.91.0",
			"constructs@10.2.69",
			"sst@^2",
			"svelte",
			"svelte-check",
			"svelte-kit-sst",
			"tslib",
			"typescript",
			"vite@4.5.0",
		],
		dev: true,
	}),
];
