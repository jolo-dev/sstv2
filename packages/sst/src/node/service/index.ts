import { createProxy } from "../util/index.js";

export type ServiceResources = {};

export const Service =
	/* @__PURE__ */
	createProxy<ServiceResources>("Service");
