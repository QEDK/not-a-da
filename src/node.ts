"use strict";
import { Elysia, t } from "elysia";
import { logger } from "@bogeychan/elysia-logger";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { bls12_381 as bls } from "@noble/curves/bls12-381";
import { Hex, PrivKey } from "@noble/curves/abstract/utils";

const s3Client = new S3Client({
	region: "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
});
const privateKey = process.env.PRIVATE_KEY as PrivKey;

const postData = async ({
	body,
	ctx,
	set,
}: { body: any; ctx: any; set: any }) => {
	try {
		const signature = bls.sign(Buffer.from(body) as unknown as Hex, privateKey);
		await s3Client.send(
			new PutObjectCommand({
				Bucket: "not-a-da",
				Key: randomUUID(),
				Body: body,
			}),
		);
		set.status = 201;
		return { signature: Buffer.from(signature).toString("hex") };
	} catch (err) {
		console.error(err);
	}
};

const main = async () => {
	const app = new Elysia({
		serve: {
			maxRequestBodySize: 1024 * 1024 * 100, // 100 MB
		},
	})
		.use(
			logger({
				level: "info",
			}),
		)
		.get("/", async () => {
			return { name: "Not A DA Node" };
		})
		.post("/submit", postData, {
			body: t.String(),
		})
		.listen((process.env.NODE_PORT as string) ?? 3000);
	console.log(`🛜  Not A DA node running at ${app.server!.url}`);
};

void main();
