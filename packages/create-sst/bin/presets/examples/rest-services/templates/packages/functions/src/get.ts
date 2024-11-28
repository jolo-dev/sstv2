import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import notes from "../../../services/notes";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
	const note = notes[event.pathParameters?.id!];
	return note
		? {
				statusCode: 200,
				body: JSON.stringify(note),
			}
		: {
				statusCode: 404,
				body: JSON.stringify({ error: true }),
			};
};
