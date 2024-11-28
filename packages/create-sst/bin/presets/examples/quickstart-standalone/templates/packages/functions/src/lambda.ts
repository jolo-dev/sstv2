import { Time } from "@@@app/core/time";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
	return {
		statusCode: 200,
		body: `Hi from SST ${Time.now()}`,
	};
});
