"use strict";
import { Elysia, t } from "elysia";
import { logger } from "@bogeychan/elysia-logger";
import { Redis } from "ioredis";

const redis = new Redis();
let cache: string = "";

const getStats = async () => {
	const [totalDataPosted, uptime, bandwidth] = await Promise.all([
		redis.get("TOTAL_DATA_POSTED"),
		redis.get("UPTIME"),
		redis.get("BANDWIDTH"),
	]);
	return { totalDataPosted, uptime, bandwidth };
};

const putData = async ({ body }: { body: any }) => {
	cache = cache.concat(body);
	if (cache.length <= 1024 * 1024 * 100) {
		return;
	} else {
		const data = Buffer.from(cache);
		// const numChunks = 100;
		// const dataPromises = [];
		// for (let i = 0; i < numChunks; i++) {
		// 	const chunk = data.slice(
		// 		i * (data.length / numChunks),
		// 		(i + 1) * (data.length / numChunks),
		// 	);
		// 	dataPromises.push(
		// 		fetch(process.env.NODE_URL as string, {
		// 			method: "POST",
		// 			body: chunk,
		// 		}),
		// 	);
		// }
		//await Promise.all(dataPromises);
		fetch(process.env.NODE_URL as string, {
			method: "POST",
			body: data,
		}),
			(cache = "");
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
			return { name: "Not A DA API" };
		})
		.get("/stats", getStats)
		.put("/submit", putData)
		.listen((process.env.PORT as string) ?? 3000);
	console.log(`🖥️ Not A DA server running at ${app.server!.url}`);
};

void main();
