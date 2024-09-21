import { bls12_381 as bls } from "@noble/curves/bls12-381";

const privateKeys = [];
const runs = Number.parseInt(process.argv.slice(2)[0]) ?? 100;
for (let i = 0; i < runs; ++i) {
  const privateKey = bls.utils.randomPrivateKey();
  privateKeys.push(Buffer.from(privateKey).toString("hex"));
}
console.log(privateKeys);
