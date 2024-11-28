import { createProxy } from "../util/index.js";

export type FunctionResources = {};

export const Function =
	/* @__PURE__ */ createProxy<FunctionResources>("Function");
