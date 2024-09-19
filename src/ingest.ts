"use strict";
import * as solanaWeb3 from "@solana/web3.js";
import { createPublicClient, http } from "viem";
import {
	arbitrum,
	avalanche,
	base,
	blast,
	fantom,
	gnosis,
	linea,
	mainnet,
	manta,
	mantle,
	metis,
	optimism,
	polygon,
	polygonZkEvm,
	taiko,
	xai,
} from "viem/chains";
import { Redis } from "ioredis";

let totalDataPosted = 0;
const startTime = Date.now();
let uptime;
let bandwidth; // in bytes per second

const redis = new Redis();

const solanaClient = new solanaWeb3.Connection(
	process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com",
	"confirmed",
);
const arbitrumClient = createPublicClient({
	chain: arbitrum,
	transport: http(
		process.env.ARBITRUM_RPC_URL ?? "https://arb1.arbitrum.io/rpc",
	),
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
const ethereumClient = createPublicClient({
	chain: mainnet,
	transport: http(
		process.env.ETHEREUM_RPC_URL ?? "https://ethereum-rpc.publicnode.com",
	),
});
const fantomClient = createPublicClient({
	chain: fantom,
	transport: http(
		process.env.FANTOM_RPC_URL ?? "https://rpcapi.fantom.network",
	),
});
const gnosisClient = createPublicClient({
	chain: gnosis,
	transport: http(process.env.GNOSIS_RPC_URL),
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
	transport: http(
		process.env.OPTIMISM_RPC_URL ?? "https://mainnet.optimism.io",
	),
});
const polygonClient = createPublicClient({
	chain: polygon,
	transport: http(process.env.POLYGON_RPC_URL),
});
const polygonZkEvmClient = createPublicClient({
	chain: polygonZkEvm,
	transport: http(process.env.POLYGONZKEVM_RPC_URL),
});
const taikoClient = createPublicClient({
	chain: taiko,
	transport: http(process.env.TAIKO_RPC_URL),
});
const xaiClient = createPublicClient({
	chain: xai,
	transport: http(process.env.XAI_RPC_URL),
});

async function postArbitrum() {
	try {
		const block = await arbitrumClient.getBlock({
			blockTag: "latest",
			includeTransactions: true,
		});
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
		totalDataPosted += data.byteLength;
		await fetch(process.env.API_URL as string, {
			method: "PUT",
			body: data,
		});
	} catch (error) {
		console.error("blast", error);
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
						'Accept': "application/json",
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
		const data = Buffer.from(block.transactions.toString());
		totalDataPosted += data.byteLength;
		await fetch(process.env.API_URL as string, {
			method: "PUT",
			body: data,
		});
	} catch (error) {
		console.error("fantom", error);
	}
}

async function postGnosis() {
	try {
		const block = await gnosisClient.getBlock({
			blockTag: "latest",
			includeTransactions: true,
		});
		const data = Buffer.from(block.transactions.toString());
		totalDataPosted += data.byteLength;
		await fetch(process.env.API_URL as string, {
			method: "PUT",
			body: data,
		});
	} catch (error) {
		console.error("gnosis", error);
	}
}

async function postLinea() {
	try {
		const block = await lineaClient.getBlock({
			blockTag: "latest",
			includeTransactions: true,
		});
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
		totalDataPosted += data.byteLength;
		await fetch(process.env.API_URL as string, {
			method: "PUT",
			body: data,
		});
	} catch (error) {
		console.error("polygonZkEvm", error);
	}
}

async function postTaiko() {
	try {
		const block = await taikoClient.getBlock({
			blockTag: "latest",
			includeTransactions: true,
		});
		const data = Buffer.from(block.transactions.toString());
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
		const data = Buffer.from(block.transactions.toString());
		totalDataPosted += data.byteLength;
		await fetch(process.env.API_URL as string, {
			method: "PUT",
			body: data,
		});
	} catch (error) {
		console.error("xai", error);
	}
}

async function solana() {
	try {
		const slot = await solanaClient.getSlot("confirmed");
		const block = await solanaClient.getBlock(slot, {
			commitment: "confirmed",
			maxSupportedTransactionVersion: 0,
			transactionDetails: "full",
			rewards: false,
		});
		const data = Buffer.from(block!.transactions.toString());
		await fetch(process.env.API_URL as string, {
			method: "PUT",
			body: data,
		});
	} catch (error) {
		console.error(error);
	}
}

async function updateStats() {
	uptime = Date.now() - startTime;
	bandwidth = totalDataPosted / uptime;
	await redis.set("TOTAL_DATA_POSTED", totalDataPosted);
	await redis.set("BANDWIDTH", bandwidth);
	await redis.set("START_TIME", startTime);
	await redis.set("UPTIME", Date.now() - startTime);
}

setInterval(async () => await postArbitrum(), 250);
setInterval(async () => await postAvalanche(), 1000);
setInterval(async () => await postBase(), 2000);
setInterval(async () => await postBlast(), 2000);
setInterval(async () => await postEthereum(), 12000);
setInterval(async () => await postFantom(), 1000);
setInterval(async () => await postGnosis(), 12000);
setInterval(async () => await postLinea(), 2000);
setInterval(async () => await postManta(), 10000);
setInterval(async () => await postMantle(), 2000);
setInterval(async () => await postMetis(), 1000);
setInterval(async () => await postOptimism(), 2000);
setInterval(async () => await postPolygon(), 2000);
setInterval(async () => await postPolygonZkEvm(), 13000);
setInterval(async () => await postTaiko(), 20000);
setInterval(async () => await postXai(), 250);
setInterval(async () => await solana(), 400);
setInterval(async () => await updateStats(), 1000);

const main = async () => {};
