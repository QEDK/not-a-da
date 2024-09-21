import * as solanaWeb3 from "@solana/web3.js";
import { initialize } from "avail-js-sdk";
import { Redis } from "ioredis";
import { http, createPublicClient } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  celo,
  cronos,
  eos,
  fantom,
  filecoin,
  flare,
  flowMainnet,
  gnosis,
  immutableZkEvm,
  linea,
  mainnet,
  manta,
  mantle,
  metis,
  optimism,
  polygon,
  polygonZkEvm,
  scroll,
  sei,
  taiko,
  xai,
} from "viem/chains";

let totalDataPosted = 0; // in bytes
let uptime = 0; // in millis
let bandwidth = 0; // in bytes per second
const startTime = Date.now(); // in millis

const redis = new Redis(
  (process.env.REDIS_URL as string) ?? "redis://localhost:6379",
);

/// ** SOLANA **
const solanaClient = new solanaWeb3.Connection(
  process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com",
  "confirmed",
);
/// ** EVM CHAINS **
const arbitrumClient = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.ARBITRUM_RPC_URL),
});
const avalancheClient = createPublicClient({
  chain: avalanche,
  transport: http(
    process.env.AVALANCHE_RPC_URL ?? "https://rpc.ankr.com/avalanche",
  ),
});
const baseClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});
const blastClient = createPublicClient({
  chain: blast,
  transport: http(process.env.BLAST_RPC_URL),
});
const bscClient = createPublicClient({
  chain: bsc,
  transport: http(process.env.BSC_RPC_URL),
});
const celoClient = createPublicClient({
  chain: celo,
  transport: http(process.env.CELO_RPC_URL),
});
const cronosClient = createPublicClient({
  chain: cronos,
  transport: http(process.env.CRONOS_RPC_URL),
});
const eosClient = createPublicClient({
  chain: eos,
  transport: http(process.env.EOS_RPC_URL),
});
const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http(
    process.env.ETHEREUM_RPC_URL ?? "https://ethereum-rpc.publicnode.com",
  ),
});
const fantomClient = createPublicClient({
  chain: fantom,
  transport: http(process.env.FANTOM_RPC_URL),
});
const filecoinClient = createPublicClient({
  chain: filecoin,
  transport: http(process.env.FILECOIN_RPC_URL),
});
const flareClient = createPublicClient({
  chain: flare,
  transport: http(process.env.FLARE_RPC_URL),
});
const flowMainnetClient = createPublicClient({
  chain: flowMainnet,
  transport: http(process.env.FLOWMAINNET_RPC_URL),
});
const gnosisClient = createPublicClient({
  chain: gnosis,
  transport: http(process.env.GNOSIS_RPC_URL),
});
const immutableZkEvmClient = createPublicClient({
  chain: immutableZkEvm,
  transport: http(process.env.IMMUTABLEZKEVM_RPC_URL),
});
const lineaClient = createPublicClient({
  chain: linea,
  transport: http(process.env.LINEA_RPC_URL),
});
const mantaClient = createPublicClient({
  chain: manta,
  transport: http(process.env.MANTA_RPC_URL),
});
const mantleClient = createPublicClient({
  chain: mantle,
  transport: http(process.env.MANTLE_RPC_URL),
});
const metisClient = createPublicClient({
  chain: metis,
  transport: http(process.env.METIS_RPC_URL),
});
const optimismClient = createPublicClient({
  chain: optimism,
  transport: http(process.env.OPTIMISM_RPC_URL),
});
const polygonClient = createPublicClient({
  chain: polygon,
  transport: http(process.env.POLYGON_RPC_URL),
});
const polygonZkEvmClient = createPublicClient({
  chain: polygonZkEvm,
  transport: http(process.env.POLYGONZKEVM_RPC_URL),
});
const scrollClient = createPublicClient({
  chain: scroll,
  transport: http(process.env.SCROLL_RPC_URL),
});
const seiClient = createPublicClient({
  chain: sei,
  transport: http(process.env.SEI_RPC_URL),
});
const taikoClient = createPublicClient({
  chain: taiko,
  transport: http(process.env.TAIKO_RPC_URL),
});
const xaiClient = createPublicClient({
  chain: xai,
  transport: http(process.env.XAI_RPC_URL),
});
/// ** DA CHAINS **
// disable stdwarn
const tempConsoleWarn = console.warn;
console.warn = () => {};
const availClient = await initialize(
  process.env.AVAIL_RPC_URL ?? "wss://mainnet-rpc.avail.so/ws",
);
// re-enable stdwarn
console.warn = tempConsoleWarn;

// eslint-disable-next-line @typescript-eslint/no-redeclare
interface BigInt {
  /** Convert to BigInt to string form in JSON.stringify */
  toJSON: () => string;
}
BigInt.prototype.toJSON = function () {
  return this.toString();
};

/// ** SOLANA **
async function postSolana() {
  try {
    const slot = await solanaClient.getSlot("confirmed");
    const block = await solanaClient.getBlock(slot, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
      transactionDetails: "full",
      rewards: true,
    });
    if (!block) return; // some slots are empty
    const data = Buffer.from(JSON.stringify(block));
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error(error);
  }
}
/// ** EVM CHAINS **
async function postArbitrum() {
  try {
    const block = await arbitrumClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("arbitrum", error);
  }
}

async function postAvalanche() {
  try {
    const block = await avalancheClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("avalanche", error);
  }
}

async function postBase() {
  try {
    const block = await baseClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("base", error);
  }
}

async function postBlast() {
  try {
    const block = await blastClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("blast", error);
  }
}

async function postBsc() {
  try {
    const block = await bscClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("bsc", error);
  }
}

async function postCelo() {
  try {
    const block = await celoClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("celo", error);
  }
}

async function postCronos() {
  try {
    const block = await cronosClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("cronos", error);
  }
}

async function postEos() {
  try {
    const block = await eosClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("eos", error);
  }
}

async function postEthereum() {
  try {
    const [executionBlock, consensusBlobs] = await Promise.all([
      ethereumClient.getBlock({
        blockTag: "latest",
        includeTransactions: true,
      }),
      fetch(
        "https://ethereum-beacon-api.publicnode.com/eth/v1/beacon/blob_sidecars/head",
        {
          headers: {
            Accept: "application/json",
          },
        },
      ),
    ]);
    const executionData = Buffer.from(executionBlock.transactions.toString());
    const consensusBlobsBuffer = Buffer.from(
      (await consensusBlobs.json()).data,
    );
    const data = new Uint8Array([...executionData, ...consensusBlobsBuffer]);
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("ethereum", error);
  }
}

async function postFantom() {
  try {
    const block = await fantomClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("fantom", error);
  }
}

async function postFilecoin() {
  try {
    const block = await filecoinClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("filecoin", error);
  }
}

async function postFlare() {
  try {
    const block = await flareClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("flare", error);
  }
}

async function postFlowMainnet() {
  try {
    const block = await flowMainnetClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("flowMainnet", error);
  }
}

async function postGnosis() {
  try {
    const block = await gnosisClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("gnosis", error);
  }
}

async function postImmutableZkEvm() {
  try {
    const block = await immutableZkEvmClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("immutableZkEvm", error);
  }
}

async function postLinea() {
  try {
    const block = await lineaClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("linea", error);
  }
}

async function postManta() {
  try {
    const block = await mantaClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("manta", error);
  }
}

async function postMantle() {
  try {
    const block = await mantleClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("mantle", error);
  }
}

async function postMetis() {
  try {
    const block = await metisClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("metis", error);
  }
}

async function postOptimism() {
  try {
    const block = await optimismClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("optimism", error);
  }
}

async function postPolygon() {
  try {
    const block = await polygonClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("polygon", error);
  }
}

async function postPolygonZkEvm() {
  try {
    const block = await polygonZkEvmClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("polygonZkEvm", error);
  }
}

async function postScroll() {
  try {
    const block = await scrollClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("scroll", error);
  }
}

async function postSei() {
  try {
    const block = await seiClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("sei", error);
  }
}

async function postTaiko() {
  try {
    const block = await taikoClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("taiko", error);
  }
}

async function postXai() {
  try {
    const block = await xaiClient.getBlock({
      blockTag: "latest",
      includeTransactions: true,
    });
    const data = Buffer.from(JSON.stringify(block));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("xai", error);
  }
}
/// ** DA CHAINS **
async function postAvail() {
  try {
    const block = await availClient.rpc.chain.getBlock();
    const data = Buffer.from(JSON.stringify(block.toPrimitive()));
    totalDataPosted += data.byteLength;
    await fetch(process.env.API_URL as string, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error("avail", error);
  }
}

/// ** MISC **
async function updateStats() {
  uptime = Date.now() - startTime;
  bandwidth = (totalDataPosted / uptime) * 1000; /// convert from bytes per millisecond to bytes per second
  await Promise.all([
    redis.set("TOTAL_DATA_POSTED", totalDataPosted),
    redis.set("BANDWIDTH", bandwidth),
    redis.set("START_TIME", startTime),
    redis.set("UPTIME", uptime),
  ]);
}

/// ** SOLANA **
setInterval(async () => await postSolana(), 400);
/// ** EVM CHAINS **
setInterval(async () => await postArbitrum(), 250);
setInterval(async () => await postAvalanche(), 1000);
setInterval(async () => await postBase(), 2000);
setInterval(async () => await postBlast(), 2000);
setInterval(async () => await postBsc(), 3000);
setInterval(async () => await postCelo(), 5000);
setInterval(async () => await postCronos(), 5000);
setInterval(async () => await postEos(), 1000);
setInterval(async () => await postEthereum(), 12000);
setInterval(async () => await postFantom(), 1000);
setInterval(async () => await postFilecoin(), 30000);
setInterval(async () => await postFlare(), 2000);
setInterval(async () => await postFlowMainnet(), 2000);
setInterval(async () => await postGnosis(), 12000);
setInterval(async () => await postImmutableZkEvm(), 2000);
setInterval(async () => await postLinea(), 2000);
setInterval(async () => await postManta(), 10000);
setInterval(async () => await postMantle(), 2000);
setInterval(async () => await postMetis(), 1000);
setInterval(async () => await postOptimism(), 2000);
setInterval(async () => await postPolygon(), 2000);
setInterval(async () => await postPolygonZkEvm(), 13000);
setInterval(async () => await postScroll(), 3000);
setInterval(async () => await postSei(), 400);
setInterval(async () => await postTaiko(), 20000);
setInterval(async () => await postXai(), 250);
/// ** DA CHAINS **
setInterval(async () => await postAvail(), 20000);

/// ** MISC **
setInterval(async () => await updateStats(), 1000);

const main = async () => {};
