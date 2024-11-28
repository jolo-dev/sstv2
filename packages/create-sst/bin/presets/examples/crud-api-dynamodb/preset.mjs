import { extend, extract, install, patch } from "create-sst";

export default [
	extend("presets/base/example"),
	extract(),
	install({
		packages: ["uuid"],
	}),
	install({
		packages: ["@types/uuid"],

		dev: true,
	}),
];
