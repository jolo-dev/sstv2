import { createProxy } from "../util/index.js";

export type KinesisStreamResources = {};

export const KinesisStream =
	/* @__PURE__ */ createProxy<KinesisStreamResources>("KinesisStream");
