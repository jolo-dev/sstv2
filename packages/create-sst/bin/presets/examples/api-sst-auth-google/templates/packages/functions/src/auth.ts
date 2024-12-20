import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AuthHandler, GoogleAdapter, Session } from "sst/node/auth";
import { StaticSite } from "sst/node/site";
import { Table } from "sst/node/table";

const GOOGLE_CLIENT_ID =
	"1051197502784-vjtbj1rnckpagefmcoqnaon0cbglsdac.apps.googleusercontent.com";

declare module "sst/node/auth" {
	export interface SessionTypes {
		user: {
			userID: string;
		};
	}
}

export const handler = AuthHandler({
	providers: {
		google: GoogleAdapter({
			mode: "oidc",
			clientID: GOOGLE_CLIENT_ID,
			onSuccess: async (tokenset) => {
				const claims = tokenset.claims();

				const ddb = new DynamoDBClient({});
				await ddb.send(
					new PutItemCommand({
						TableName: Table.users.tableName,
						Item: marshall({
							userId: claims.sub,
							email: claims.email,
							picture: claims.picture,
							name: claims.given_name,
						}),
					}),
				);

				return Session.parameter({
					redirect: StaticSite.site.url || "http://127.0.0.1:5173",
					type: "user",
					properties: {
						userID: claims.sub,
					},
				});
			},
		}),
	},
});
