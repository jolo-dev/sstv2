import type { HeaderBag } from "@aws-sdk/types";
import type { CloudFrontHeaders } from "aws-lambda";

export const headerBagToCloudFrontHeaders = (
	headerBag: HeaderBag,
): CloudFrontHeaders => {
	const cloudFrontHeaders: CloudFrontHeaders = {};
	for (const [header, value] of Object.entries(headerBag)) {
		// 'Authorization' header does not support multiple header fields
		// cloudFrontHeaders[header] = value.split(',').map((v) => ({ key: header, value: v }));
		cloudFrontHeaders[header] = [{ key: header, value }];
	}
	return cloudFrontHeaders;
};
