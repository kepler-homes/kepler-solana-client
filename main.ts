import { KeplerClient } from "./sdk/sdk";
import * as bs58 from "bs58";
import { privateKey } from "./key.json";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
const axios = require("axios");
import nacl from "tweetnacl";
import { decodeUTF8 } from "tweetnacl-util";
import base58 from "bs58";

var client: KeplerClient;
var user: Keypair;

const apiDomain = "https://solana-abi.kepler.homes";
let token = "";

async function login() {
    const message = "login";
    const messageBytes = decodeUTF8(message);
    const signature = base58.encode(nacl.sign.detached(messageBytes, user.secretKey));
    const url = `${apiDomain}/api/user/login?address=${user.publicKey.toBase58()}&signature=${signature}`;
    console.log("url: ", url);
    let res = await axios.get(url);
    token = res.data.data.token;
    console.log("token:", token);
}

async function setInviteCode() {
    const url = `${apiDomain}/api/user/inviter?invite_code=KEPL_12345678&Authorization=${token}`;
    console.log("set invite code url: ", url);
    let res = await axios.post(url);
    console.log("set invite code", res.data);
}

async function main() {
    // client = new KeplerClient("https://api.mainnet-beta.solana.com");
    client = KeplerClient.fromEndpoint("https://api.devnet.solana.com");
    user = Keypair.fromSecretKey(bs58.decode(privateKey));
    await login();
    await setInviteCode();
    console.log("user", user.publicKey.toBase58());

    await verifyLending();
    await verifyPetBuy();
    await verifyPetUpgrade();
    await verifyPetMint();
    await verifyFoodBuy();
    await verifyLandUpgrade();
}


async function verifyLandUpgrade() {
    const currency = client.findGkeplTokenPDA();
    console.log("user", user.publicKey.toBase58());
    console.log("currency", currency.toBase58());
    const url = `${apiDomain}/api/land/upgradeParams?Authorization=${token}&user=${user.publicKey.toBase58()}&currency=${currency.toBase58()}`;
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
    const borrowAmount = new BN(200000e6);
    console.log("lendingBorrow", await client.lendingBorrow(user, borrowAmount));
    const repayAmount = new BN(10e6);
    console.log("lendingRepay", await client.lendingRepay(user, repayAmount));
}

async function verifyFoodBuy() {
    const currency = client.findGkeplTokenPDA();
    const storeFoodId = new BN(4);
    const amount = new BN(2);
    console.log("user", user.publicKey.toBase58());
    console.log("currency", currency.toBase58());
    const url = `${apiDomain}/api/food/buyParams?Authorization=${token}&user=${user.publicKey.toBase58()}&currency=${currency.toBase58()}&store_food_id=${storeFoodId.toNumber()}&amount=${amount.toNumber()}`;
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

//确保用户账号有足够gkepl币
async function verifyPetBuy() {
    const currency = client.findGkeplTokenPDA();
    const storePetId = new BN(2);
    console.log("currency", currency.toBase58());
    const url = `${apiDomain}/api/pet/buyParams?Authorization=${token}&user=${user.publicKey.toBase58()}&currency=${currency.toBase58()}&store_pet_id=${storePetId.toNumber()}`;
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
    const url = `${apiDomain}/api/pet/userPets?Authorization=${token}`;
    let res = await axios.get(url);
    return res?.data?.data || [];
}

async function verifyPetUpgrade() {
    let pets = await queryUserPets();
    console.log("user pets", JSON.stringify(pets));
    if (pets.length > 0) {
        const currency = client.findGkeplTokenPDA();
        const userPetId = new BN(pets.pop().id);
        console.log("currency", currency.toBase58());
        const url = `${apiDomain}/api/pet/upgradeParams?Authorization=${token}&user=${user.publicKey.toBase58()}&currency=${currency.toBase58()}&user_pet_id=${userPetId.toNumber()}`;
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
        const currency = client.findGkeplTokenPDA();
        const userPetId = new BN(pets.pop().id);
        console.log("user", user.publicKey.toBase58());
        console.log("currency", currency.toBase58());
        const url = `${apiDomain}/api/pet/mintParams?Authorization=${token}&user=${user.publicKey.toBase58()}&currency=${currency.toBase58()}&user_pet_id=${userPetId.toNumber()}`;
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
