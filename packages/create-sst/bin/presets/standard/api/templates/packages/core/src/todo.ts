export * as Todo from "./todo";
import crypto from "crypto";
import { z } from "zod";

import { event } from "./event";

export const Events = {
	Created: event(
		"todo.created",
		z.object({
			id: z.string(),
		}),
	),
};

export async function create() {
	const id = crypto.randomUUID();
	// write to database

	await Events.Created.publish({
		id,
	});
}

export function list() {
	return Array(50)
		.fill(0)
		.map((_, index) => ({
			id: crypto.randomUUID(),
			title: "Todo #" + index,
		}));
}
