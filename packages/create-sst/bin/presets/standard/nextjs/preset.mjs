import { cmd, extend, extract, install, patch, str_replace } from "create-sst";
export default [
	extend("presets/base/monorepo"),
	cmd({
		cmd: "npx --silent create-next-app@latest web --ts --no-eslint --no-src-dir --no-tailwind --no-app --no-experimental-app --import-alias '@/*'",
		cwd: "packages",
	}),
	patch({
		file: "packages/web/tsconfig.json",
		operations: [
			{
				op: "add",
				path: "/compilerOptions/paths/@@@app~1core~1*",
				value: ["../core/src/*"],
			},
		],
	}),
	install({
		packages: ["sst@^2"],
		path: "packages/web",
		dev: true,
	}),
	patch({
		file: "packages/web/package.json",
		operations: [
			{ op: "add", path: "/scripts/dev", value: "sst bind next dev" },
		],
	}),
	extract(),
	str_replace({
		file: "sst.config.ts",
		pattern: `import { SSTConfig } from "sst";`,
		replacement: [
			`import { SSTConfig } from "sst";`,
			`import { Default } from "./stacks/Default";`,
		].join("\n"),
	}),
	str_replace({
		file: "sst.config.ts",
		pattern: `stacks(app) {},`,
		replacement: [`stacks(app) {`, `    app.stack(Default);`, `  }`].join("\n"),
	}),
];
