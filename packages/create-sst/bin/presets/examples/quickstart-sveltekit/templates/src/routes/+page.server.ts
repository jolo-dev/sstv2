import crypto from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket } from "sst/node/bucket";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const command = new PutObjectCommand({
		ACL: "public-read",
		Key: crypto.randomUUID(),
		Bucket: Bucket.public.bucketName,
	});
	const url = await getSignedUrl(new S3Client({}), command);

	return { url };
}) satisfies PageServerLoad;
