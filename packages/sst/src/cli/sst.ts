#!/usr/bin/env node

import { blue, red } from "colorette";

import { SilentError, VisibleError } from "../error.js";
import { program } from "./program.js";
import { useSpinners } from "./spinner.js";

import dotenv from "dotenv";
dotenv.config({
	override: true,
});
dotenv.config({
	path: ".env.local",
	override: true,
});

import { bind } from "./commands/bind.js";
import { bootstrap } from "./commands/bootstrap.js";
import { build } from "./commands/build.js";
import { consoleCommand } from "./commands/console.js";
import { deploy } from "./commands/deploy.js";
import { dev } from "./commands/dev.js";
import { diff } from "./commands/diff.js";
import { remove } from "./commands/remove.js";
import { secrets } from "./commands/secrets/secrets.js";
import { telemetry } from "./commands/telemetry.js";
import { transform } from "./commands/transform.js";
import { types } from "./commands/types.js";
import { update } from "./commands/update.js";
import { version } from "./commands/version.js";

bootstrap(program);
dev(program);
deploy(program);
build(program);
bind(program);
secrets(program);
remove(program);
update(program);
transform(program);
consoleCommand(program);
diff(program);
version(program);
telemetry(program);
types(program);

if ("setSourceMapsEnabled" in process) {
	// @ts-expect-error
	process.setSourceMapsEnabled(true);
}
process.removeAllListeners("uncaughtException");
process.on("uncaughtException", (err) => {
	const spinners = useSpinners();
	for (const spinner of spinners) {
		if (spinner.isSpinning) spinner.fail(spinner.text);
	}

	if (!(err instanceof SilentError)) {
		console.log();
		console.log(red("Error:"), err.message);
		if (!(err instanceof VisibleError)) {
			console.log();
			console.trace(err.stack);
		}
	}

	process.exit(1);
});

// Check Node version
const nodeVersion = process.versions.node;
if (Number(nodeVersion.split(".")[0]) < 18) {
	throw new VisibleError(
		`Node.js version ${nodeVersion} is not supported by SST. Please upgrade to Node.js 18 or later.`,
	);
}

program.parse();
