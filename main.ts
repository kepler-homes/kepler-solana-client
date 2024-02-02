import { KeplerClient } from "./sdk/sdk";
import * as bs58 from "bs58";
import { privateKey } from "./key.json";
import { Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

var client: KeplerClient;
var user: Keypair;

async function main() {
    // client = new KeplerClient("https://api.mainnet-beta.solana.com");
    client = KeplerClient.fromEndpoint("https://api.devnet.solana.com");
    user = Keypair.fromSecretKey(bs58.decode(privateKey));
    console.log("user", user.publicKey.toBase58());
    const borrowAmount = new BN(20e6);
    console.log("lendingBorrow", await client.lendingBorrow(user, borrowAmount));
    const repayAmount = new BN(10e6);
    console.log("lendingRepay", await client.lendingRepay(user, repayAmount));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
