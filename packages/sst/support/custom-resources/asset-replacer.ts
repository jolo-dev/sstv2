import fs from "fs";
import os from "os";
import path from "path";
import type { Readable } from "stream";
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import AdmZip from "adm-zip";
import minimatch from "minimatch";
import type { BaseSiteReplaceProps } from "../../src/constructs/BaseSite";
import { sdkLogger } from "./util.js";

const s3 = new S3Client({ logger: sdkLogger });
const zipPath = path.join(os.tmpdir(), "asset.zip");

export async function AssetReplacer(cfnRequest: any) {
	switch (cfnRequest.RequestType) {
		case "Create":
		case "Update":
			const { bucket, key, replacements } = cfnRequest.ResourceProperties;
			if (replacements.length === 0) {
				return;
			}

			console.log({ zipPath });

			// Clean up old files
			fs.rmSync(zipPath, { force: true });

			await download(bucket, key);
			replaceValues(replacements);
			await upload(bucket, key);
			break;
		case "Delete":
			break;
		default:
			throw new Error("Unsupported request type");
	}
}

function replaceValues(replacements: BaseSiteReplaceProps[]) {
	const zip = new AdmZip(zipPath);
	zip
		.getEntries()
		.filter((entry) => !entry.entryName.includes("node_modules/"))
		.forEach((entry) => {
			console.log(entry.entryName);
			for (const r of replacements) {
				if (minimatch(entry.entryName, r.files, { dot: true })) {
					console.log("replace file", r.files, entry.entryName);
					const data = entry
						.getData()
						.toString("utf-8")
						.replaceAll(r.search, r.replace);
					zip.updateFile(entry.entryName, Buffer.from(data, "utf-8"));
				}
			}
		});
	zip.writeZip();
}

async function download(bucket: string, key: string) {
	console.log("download");

	const result = await s3.send(
		new GetObjectCommand({
			Key: key,
			Bucket: bucket,
		}),
	);
	const stream = result.Body as Readable;
	await new Promise<void>((resolve, reject) =>
		stream
			.pipe(fs.createWriteStream(zipPath))
			.on("error", reject)
			.on("close", () => resolve()),
	);
}

async function upload(bucket: string, key: string) {
	console.log("upload");

	await s3.send(
		new PutObjectCommand({
			Key: key,
			Bucket: bucket,
			Body: fs.createReadStream(zipPath),
		}),
	);
}
