export * as Dynamo from "./dynamo";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { EntityConfiguration } from "electrodb";
import { Table } from "sst/node/table";

export const Client = new DynamoDBClient({});

export const Configuration: EntityConfiguration = {
	table: Table.db.tableName,
	client: Client,
};
