import type { SSTConfig } from "sst";
import { API, Web } from "./stacks/MyStack";

export default {
	config(_input) {
		return {
			name: "@@app",
			region: "us-east-1",
		};
	},
	stacks(app) {
		app.stack(API).stack(Web);
	},
} satisfies SSTConfig;
