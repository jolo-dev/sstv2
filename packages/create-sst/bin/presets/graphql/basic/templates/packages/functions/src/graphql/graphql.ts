import { GraphQLHandler } from "sst/node/graphql";
import { schema } from "./schema";

export const handler = GraphQLHandler({
	schema,
});
