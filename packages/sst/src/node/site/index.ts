import { createProxy } from "../util/index.js";

export type StaticSiteResources = {};
export type NextjsSiteResources = {};
export type AstroSiteResources = {};
export type RemixSiteResources = {};
export type SolidStartSiteResources = {};
export type SvelteKitSiteResources = {};

export const StaticSite =
	/* @__PURE__ */ createProxy<StaticSiteResources>("StaticSite");
export const AstroSite =
	/* @__PURE__ */
	createProxy<AstroSiteResources>("AstroSite");
export const RemixSite =
	/* @__PURE__ */
	createProxy<RemixSiteResources>("RemixSite");
export const NextjsSite =
	/* @__PURE__ */
	createProxy<NextjsSiteResources>("NextjsSite");
export const SolidStartSite =
	/* @__PURE__ */
	createProxy<SolidStartSiteResources>("SolidStartSite");

export const SvelteKitSite =
	/* @__PURE__ */
	createProxy<SvelteKitSiteResources>("SvelteKitSite");
