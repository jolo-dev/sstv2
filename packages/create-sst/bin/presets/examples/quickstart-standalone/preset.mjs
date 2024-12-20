import {
	cmd,
	extend,
	extract,
	install,
	patch,
	remove,
	str_replace,
} from "create-sst";
export default [
	extend("presets/standard/api"),
	cmd({
		cmd: "npx create-vite@latest web --template=react-ts",
		cwd: "packages",
	}),
	extract(),
	install({
		packages: ["sst@^2"],
		path: "packages/web",
		dev: true,
	}),
	patch({
		file: "packages/web/package.json",
		operations: [{ op: "add", path: "/scripts/dev", value: "sst bind vite" }],
	}),
];
