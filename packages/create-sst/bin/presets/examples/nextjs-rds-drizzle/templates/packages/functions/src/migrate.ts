import { migrate } from "@drizzle-sst/web/drizzle";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_event) => {
	await migrate("migrations");
	return {
		body: "Migrations completed",
	};
});
