import { logger } from "@bogeychan/elysia-logger";
import { Elysia, t } from "elysia";
import { ReedSolomon, dataMatrix } from "gnablib/ecc";
import { Redis } from "ioredis";

const redis = new Redis(
  (process.env.REDIS_URL as string) ?? "redis://localhost:6379",
);
let cache = "";

const getStats = async () => {
  const [totalDataPosted, uptime, bandwidth] = await Promise.all([
    redis.get("TOTAL_DATA_POSTED"),
    redis.get("UPTIME"),
    redis.get("BANDWIDTH"),
  ]);
  return { totalDataPosted, uptime, bandwidth };
};

const putData = async ({
  body,
  log,
  error,
}: { body: any; log: any; error: any }) => {
  try {
    cache = cache.concat(body);
    const cacheLen = 1024 * 1024; // 1 MB
    if (cache.length <= cacheLen) {
      return;
    }
    const ecLen = cacheLen * 3;
    const data = Uint8Array.from(Buffer.from(cache));
    const rsArr = new Uint8Array(data.length + ecLen);
    rsArr.set(data, 0);
    const rs = new ReedSolomon(dataMatrix());
    rs.encode(rsArr, ecLen);
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
    await fetch(process.env.NODE_URL as string, {
      method: "POST",
      body: Buffer.from(rsArr).toString("hex"),
      headers: {
        "Content-Type": "text/plain",
      },
    });
    cache = "";
  } catch (err) {
    log.error(err);
    error(500);
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
  console.log(`🖥️ Not A DA server running at ${app.server?.url}`);
};

void main();
