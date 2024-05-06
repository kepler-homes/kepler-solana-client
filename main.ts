import { XbotClient } from "./sdk/sdk";
import * as bs58 from "bs58";
import { privateKey } from "./key.json";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
const axios = require("axios");
import base58 from "bs58";

let client = XbotClient.fromEndpoint("https://api.devnet.solana.com");
let user = Keypair.fromSecretKey(bs58.decode(privateKey));
let address = user.publicKey.toBase58();
const prefix = "https://b.kepler.homes/api/xbot";
const NETWORK_TOKENS = {
    devnet: {
        krp: new PublicKey("GMh5KoUfUxdFRKQdYxWzJjYhoQ9PCNWxYw1tA3XXgmhi"),
        gkrp: new PublicKey("6jzYRF9MTWJn4JoFXPJd8RJwiYyNRWEApbru4pvTvxHC"),
    },
    mainnet: {
        krp: new PublicKey("7UXKboga8ZiceA6FkxWQJC1MRjqSpBbmtt3CUAuJqCDt"),
        gkrp: new PublicKey("9JSVhycyit58LmwsZisTgX6GxE1r9ktfCxUhNPRCBUEX"),
    },
};
let tokens = NETWORK_TOKENS[client.getNetworkName()];

async function main() {
    // client = new XbotClient("https://api.mainnet-beta.solana.com");
    console.log("user", user.publicKey.toBase58());
    // await verifyLending();
    // await verifyPetBuy();
    // await verifyPetUpgrade();
    // await verifyPetMint();
    // await verifyFoodBuy();
    // await verifyLandUpgrade();
    // await verifyClaimToken();
    await verifyAirdrop();
}

async function verifyAirdrop() {
    console.log("user", user.publicKey.toBase58());
    const url = `${prefix}/airdrop/airdropParams?address=${user.publicKey.toBase58()}&code=12345678`;
    console.log("url", url);
    let res = await axios.get(url);
    console.log(res.data);
    let { airdrop_id, amount, expire_at, message, recipient, signature, signer, token_mint } = res.data.data;
    const ts = await client.airdrop(
        user,
        new PublicKey(token_mint),
        new PublicKey(recipient),
        new BN(airdrop_id),
        new BN(expire_at),
        new BN(amount),
        new PublicKey(signer),
        base58.decode(message),
        base58.decode(signature)
    );
    console.log("airdrop", ts);
}
async function verifyClaimToken() {
    console.log("user", user.publicKey.toBase58());
    const url = `${prefix}/token/claimGKeplParams?uuuu=${address}`;
    console.log("url", url);
    let res = await axios.get(url);
    console.log(res.data);
    const data = res.data.data;
    const ts = await client.claimToken(
        user,
        new PublicKey(data.token_mint),
        new BN(data.claim_id),
        new BN(data.expire_at),
        new BN(data.amount),
        new PublicKey(data.signer),
        base58.decode(data.message),
        base58.decode(data.signature)
    );
    console.log("claimToken", ts);
}

async function verifyLandUpgrade() {
    const currency = tokens.gkrp;
    console.log("user", user.publicKey.toBase58());
    console.log("currency", currency.toBase58());
    const url = `${prefix}/land/upgradeParams?uuuu=${address}&currency=${currency.toBase58()}`;
    console.log("url", url);
    let res = await axios.get(url);
    console.log(res.data);
    let { price, referrer, message, signature, fee_to, level, signer } = res.data.data;
    const ts = await client.landUpgrade(
        user,
        new BN(level),
        currency,
        new BN(price),
        new PublicKey(referrer),
        new PublicKey(fee_to),
        new PublicKey(signer),
        base58.decode(message),
        base58.decode(signature)
    );
    console.log("landUpgrade", ts);
}

async function verifyLending() {
    // get sol price from https://docs.chain.link/data-feeds/solana/using-data-feeds-off-chain

    const solAmount = new BN(1e9);
    //estimated token amount
    // let usd_amount = i128::from(sol_amount) * sol_price / 10i128.pow(u32::from(sol_decimals)) / 1000;
    // let token_amount = usd_amount * 1_000_000 / token_price * 85 / 100;
    console.log("lendingBorrow", await client.lendingBorrow(user, tokens.gkrp, solAmount));

    const tokenAmount = new BN(111e6);
    //estimated sol amount
    // let usd_amount = i128::from(token_amount) * token_price / 1_000_000 * 100 / 85;
    // let sol_amount = usd_amount * 1000 * 10i128.pow(u32::from(decimals)) / sol_price;
    console.log("lendingRepay", await client.lendingRepay(user, tokens.gkrp, tokenAmount));
}

async function verifyFoodBuy() {
    const currency = tokens.gkrp;
    const storeFoodId = new BN(4);
    const amount = new BN(2);
    console.log("user", user.publicKey.toBase58());
    console.log("currency", currency.toBase58());
    const url = `${prefix}/food/buyParams?address=${user.publicKey.toBase58()}&currency=${currency.toBase58()}&store_food_id=${storeFoodId.toNumber()}&amount=${amount.toNumber()}`;
    console.log("url", url);
    let res = await axios.get(url);
    console.log(res.data);
    let { price, referrer, message, signature, fee_to, signer } = res.data.data;
    const ts = await client.foodBuy(
        user,
        storeFoodId,
        currency,
        amount,
        new BN(price),
        new PublicKey(referrer),
        new PublicKey(fee_to),
        new PublicKey(signer),
        base58.decode(message),
        base58.decode(signature)
    );
    console.log("foodBuy", ts);
}

//确保用户账号有足够gkrp币
async function verifyPetBuy() {
    const currency = tokens.gkrp;
    const storePetId = new BN(2);
    console.log("currency", currency.toBase58());
    const url = `${prefix}/pet/buyParams?uuuu=${address}&currency=${currency.toBase58()}&store_pet_id=${storePetId.toNumber()}`;
    console.log("url", url);
    let res = await axios.get(url);
    console.log(res.data);
    let { price, referrer, message, signature, fee_to, signer } = res.data.data;
    const ts = await client.petBuy(
        user,
        storePetId,
        currency,
        new BN(price),
        new PublicKey(referrer),
        new PublicKey(fee_to),
        new PublicKey(signer),
        base58.decode(message),
        base58.decode(signature)
    );
    console.log("petBuy", ts);
}

async function queryUserPets() {
    const url = `${prefix}/pet/userPets?uuuu=${address}`;
    let res = await axios.get(url);
    return res?.data?.data || [];
}

async function verifyPetUpgrade() {
    let pets = await queryUserPets();
    console.log("user pets", JSON.stringify(pets));
    if (pets.length > 0) {
        const currency = tokens.gkrp;
        const userPetId = new BN(pets.pop().id);
        console.log("currency", currency.toBase58());
        const url = `${prefix}/pet/upgradeParams?uuuu=${address}&currency=${currency.toBase58()}&user_pet_id=${userPetId.toNumber()}`;
        console.log("url", url);
        let res = await axios.get(url);
        console.log(res.data);
        let { price, referrer, message, signature, fee_to, target_level, signer } = res.data.data;
        // console.log({ price, referrer, message, signature, fee_to, target_level });
        const ts = await client.petUpgrade(
            user,
            userPetId,
            new BN(target_level),
            currency,
            new BN(price),
            new PublicKey(referrer),
            new PublicKey(fee_to),
            new PublicKey(signer),
            base58.decode(message),
            base58.decode(signature)
        );
        console.log("petUpgrade", ts);
    }
}

async function verifyPetMint() {
    let pets = await queryUserPets();
    console.log("user pets", JSON.stringify(pets));
    pets = pets.filter((item) => item.token_id == 0);
    if (pets.length > 0) {
        const currency = tokens.gkrp;
        const userPetId = new BN(pets.pop().id);
        console.log("user", user.publicKey.toBase58());
        console.log("currency", currency.toBase58());
        const url = `${prefix}/pet/mintParams?uuuu=${address}&currency=${currency.toBase58()}&user_pet_id=${userPetId.toNumber()}`;
        console.log("url", url);
        let res = await axios.get(url);
        console.log(res.data);
        let { message, signature, signer } = res.data.data;
        const ts = await client.petMint(user, userPetId, new PublicKey(signer), base58.decode(message), base58.decode(signature));
        console.log("petMint", ts);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
