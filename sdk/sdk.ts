import * as anchor from "@coral-xyz/anchor";
import { Program, BN, EventParser, BorshCoder, AnchorProvider, Provider } from "@coral-xyz/anchor";
import { Xbot, IDL } from "../target/types/xbot";
import { Keypair, PublicKey, Connection, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as spl from "@solana/spl-token";
import { Key, Metadata, PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { Metaplex } from "@metaplex-foundation/js";
import { hexToBytes, padLeft } from "web3-utils";

export class XbotClient {
    // https://docs.chain.link/data-feeds/solana/using-data-feeds-solana
    //The program that owns the data feeds on both Devnet and Mainnet is HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny.
    CHAINLINK_PROGRAM_ID = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";
    public connection: Connection;
    public program: Program<Xbot>;
    public metaplex: Metaplex;
    public eventParser: EventParser;
    public endpoint: string;

    public petCollectionMatadata = {
        name: "xBot Characters",
        symbol: "xBotCharCl",
        uri: "https://xbot.bi/api/xbot/metadata/collection",
    };

    public static programId: string = "AL5nyFaZSf3wTDzNY22Ne4mdyPg3tq48ig5VBHvLTyS8";

    public static fromEndpoint(endpoint: string) {
        const provider = new AnchorProvider(new Connection(endpoint), null, AnchorProvider.defaultOptions());
        const program = new Program(IDL, new PublicKey(XbotClient.programId), provider);
        return new XbotClient(program);
    }

    constructor(program: Program<Xbot>) {
        this.connection = program["_provider"].connection;
        this.program = program;
        this.metaplex = Metaplex.make(this.connection);
        this.eventParser = new EventParser(this.program.programId, new BorshCoder(this.program.idl));
        this.endpoint = this.connection["_rpcEndpoint"];
    }

    findTokenPDA(name: string) {
        return PublicKey.findProgramAddressSync([Buffer.from(name)], this.program.programId)[0];
    }

    findPetCollectionPDA() {
        return this.findTokenPDA(this.petCollectionMatadata.name);
    }

    findLendingAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Lending")], this.program.programId)[0];
    }

    findXbotAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("XBot")], this.program.programId)[0];
    }

    findPetAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Pet")], this.program.programId)[0];
    }

    findLandAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Land")], this.program.programId)[0];
    }

    findSolValultAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Vault")], this.program.programId)[0];
    }

    findVaultTokenAccountPDA(mint: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from("Vault"), mint.toBuffer()], this.program.programId)[0];
    }

    findLendingUserAccountPDA(user: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from("LendingUser"), user.toBuffer()], this.program.programId)[0];
    }

    findClaimUserAccountPDA(mint: PublicKey, user: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from("ClaimUser"), mint.toBuffer(), user.toBuffer()], this.program.programId)[0];
    }

    findAirdropUserAccountPDA(mint: PublicKey, user: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from("AirdropUser"), mint.toBuffer(), user.toBuffer()], this.program.programId)[0];
    }

    findLandUserAccountPDA(user: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from("LandUser"), user.toBuffer()], this.program.programId)[0];
    }
    getNetworkName() {
        const url = this.connection["_rpcEndpoint"];
        if (url.indexOf("mainnet") > 0) return "mainnet";
        if (url.indexOf("testnet") > 0) return "testnet";
        if (url.indexOf("devnet") > 0) return "devnet";
        return "localhost";
    }
    async queryLendingAccount() {
        return await this.program.account.lendingAccount.fetchNullable(this.findLendingAccountPDA());
    }

    async queryPetAccount() {
        return await this.program.account.petAccount.fetchNullable(this.findPetAccountPDA());
    }

    async queryXbotAccount() {
        return await this.program.account.xbotAccount.fetchNullable(this.findXbotAccountPDA());
    }

    async queryLendingUserAccount(user: PublicKey) {
        const pda = this.findLendingUserAccountPDA(user);
        return await this.program.account.lendingUserAccount.fetchNullable(pda);
    }

    async queryClaimUserAccount(mint: PublicKey, user: PublicKey) {
        const pda = this.findClaimUserAccountPDA(mint, user);
        return await this.program.account.claimUserAccount.fetchNullable(pda);
    }

    async queryAirdropUserAccount(mint: PublicKey, user: PublicKey) {
        const pda = this.findAirdropUserAccountPDA(mint, user);
        return await this.program.account.airdropUserAccount.fetchNullable(pda);
    }

    parseEvents(tx: anchor.web3.VersionedTransactionResponse) {
        return this.eventParser.parseLogs(tx.meta.logMessages);
    }

    async queryPetCollectionMetadata() {
        const metadataPDA = this.metaplex.nfts().pdas().metadata({ mint: this.findPetCollectionPDA() });
        return await this.queryMetadata(metadataPDA);
    }

    async queryMetadata(pda: PublicKey) {
        const accInfo = await this.connection.getAccountInfo(pda);
        return accInfo && Metadata.deserialize(accInfo.data, 0)[0];
    }

    async queryTokenMetadata(name: string) {
        const tokenMintPDA = this.findTokenPDA(name);
        const metadataPDA = this.metaplex.nfts().pdas().metadata({ mint: tokenMintPDA });
        return await this.queryMetadata(metadataPDA);
    }

    bnToBytes(b: BN) {
        return hexToBytes(padLeft(b.toBuffer().toString("hex"), 8 * 2));
    }

    async createToken(admin: Keypair, name: string, symbol: string, uri: string) {
        const tokenMintPDA = this.findTokenPDA(name);
        const metadataPDA = this.metaplex.nfts().pdas().metadata({ mint: tokenMintPDA });
        const method = this.program.methods.createToken(name, symbol, uri).accounts({
            admin: admin.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            metadataAccount: metadataPDA,
            tokenMint: tokenMintPDA,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return this.exec([admin], await method.transaction());
    }

    async mintToken(admin: Keypair, tokenName: string, to: PublicKey, amount: BN) {
        const tokenMintPDA = this.findTokenPDA(tokenName);
        console.log(`${tokenName}: ${tokenMintPDA}`);
        let tokenAccount = await spl.getOrCreateAssociatedTokenAccount(this.connection, admin, tokenMintPDA, to);
        const method = this.program.methods.mintToken(tokenName, amount).accounts({
            user: admin.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            tokenMint: tokenMintPDA,
            tokenAccount: tokenAccount.address,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
        });
        return this.exec([admin], await method.transaction());
    }

    async getTokenBalance(mint: PublicKey, user: PublicKey) {
        let tokenAccount = spl.getAssociatedTokenAddressSync(mint, user);
        try {
            return (await this.connection.getTokenAccountBalance(tokenAccount)).value;
        } catch (err) {
            return {};
        }
    }

    async createCollection(admin: Keypair, name: string, symbol: string, uri: string) {
        const collectionPDA = this.findPetCollectionPDA();
        const collectionMetadataPDA = this.metaplex.nfts().pdas().metadata({ mint: collectionPDA });
        const collectionMasterEditionPDA = this.metaplex.nfts().pdas().masterEdition({ mint: collectionPDA });
        const collectionTokenAccount = await spl.getAssociatedTokenAddress(collectionPDA, admin.publicKey);
        let method = this.program.methods.createCollection(name, symbol, uri).accounts({
            authority: admin.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            collectionMint: collectionPDA,
            metadataAccount: collectionMetadataPDA,
            masterEdition: collectionMasterEditionPDA,
            tokenAccount: collectionTokenAccount,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
        });
        const modifyComputeUnits = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 40_0000 });
        return this.exec([admin], modifyComputeUnits, await method.transaction());
    }

    async createPetCollection(admin: Keypair) {
        const { name, symbol, uri } = this.petCollectionMatadata;
        return await this.createCollection(admin, name, symbol, uri);
    }

    findMetadataPDA(mint: PublicKey) {
        return this.metaplex.nfts().pdas().metadata({ mint });
    }

    findMasterEditionPDA(mint: PublicKey) {
        return this.metaplex.nfts().pdas().masterEdition({ mint });
    }

    async petInitialize(admin: Keypair) {
        const method = this.program.methods.petInitialize().accounts({
            admin: admin.publicKey,
            petAccount: this.findPetAccountPDA(),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return this.exec([admin], await method.transaction());
    }
    async foodBuy(
        user: Keypair,
        storeFoodId: BN,
        currency: PublicKey,
        amount: BN,
        price: BN,
        referrer: PublicKey,
        feeTo: PublicKey,
        signer: PublicKey,
        message: Uint8Array,
        signature: Uint8Array
    ) {
        const vaultTokenAccount = spl.getAssociatedTokenAddressSync(currency, feeTo);
        const userTokenAccount = spl.getAssociatedTokenAddressSync(currency, user.publicKey);
        const method = this.program.methods.foodBuy(storeFoodId, currency, amount, price, referrer, Array.from(signature)).accounts({
            user: user.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            vaultTokenAccount,
            userTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });

        return this.exec([user], this.getEdIx(signer, message, signature), await method.transaction());
    }

    async petBuy(
        user: Keypair,
        storePetId: BN,
        currency: PublicKey,
        price: BN,
        referrer: PublicKey,
        feeTo: PublicKey,
        signer: PublicKey,
        message: Uint8Array,
        signature: Uint8Array
    ) {
        const vaultTokenAccount = spl.getAssociatedTokenAddressSync(currency, feeTo);
        const userTokenAccount = spl.getAssociatedTokenAddressSync(currency, user.publicKey);
        const method = this.program.methods.petBuy(storePetId, currency, price, referrer, Array.from(signature)).accounts({
            user: user.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            vaultTokenAccount,
            userTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        return await this.exec([user], this.getEdIx(signer, message, signature), await method.transaction());
    }

    private getEdIx(signer: PublicKey, message: Uint8Array, signature: Uint8Array): TransactionInstruction {
        return anchor.web3.Ed25519Program.createInstructionWithPublicKey({
            publicKey: signer.toBytes(),
            message,
            signature,
        });
    }

    findPetNftPDA(userPetId: BN) {
        return PublicKey.findProgramAddressSync([Buffer.from(this.petCollectionMatadata.name), this.bnToBytes(userPetId)], this.program.programId)[0];
    }

    async claimToken(user: Keypair, mint: PublicKey, claimId: BN, expireAt: BN, amount: BN, signer: PublicKey, message: Uint8Array, signature: Uint8Array) {
        const method = this.program.methods.claimToken(claimId, expireAt, amount, Array.from(signature)).accounts({
            user: user.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            tokenMint: mint,
            vaultTokenAccount: this.findVaultTokenAccountPDA(mint),
            userTokenAccount: spl.getAssociatedTokenAddressSync(mint, user.publicKey),
            userAccount: this.findClaimUserAccountPDA(mint, user.publicKey),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        return await this.exec([user], this.getEdIx(signer, message, signature), await method.transaction());
    }

    async airdrop(
        user: Keypair,
        mint: PublicKey,
        recipient: PublicKey,
        airdropId: BN,
        expireAt: BN,
        amount: BN,
        signer: PublicKey,
        message: Uint8Array,
        signature: Uint8Array
    ) {
        const method = this.program.methods.airdrop(airdropId, expireAt, amount, Array.from(signature)).accounts({
            user: user.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            tokenMint: mint,
            vaultTokenAccount: this.findVaultTokenAccountPDA(mint),
            recipientTokenAccount: spl.getAssociatedTokenAddressSync(mint, recipient),
            recipient,
            userAccount: this.findAirdropUserAccountPDA(mint, user.publicKey),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        return await this.exec([user], this.getEdIx(signer, message, signature), await method.transaction());
    }

    private async exec(signers: Keypair[], ...transactions: (Transaction | TransactionInstruction)[]) {
        let tx = new Transaction();
        for (let i of transactions) {
            tx.add(i);
        }
        return await anchor.web3.sendAndConfirmTransaction(this.connection, tx, signers, { skipPreflight: true });
    }

    async petMint(user: Keypair, userPetId: BN, signer: PublicKey, message: Uint8Array, signature: Uint8Array) {
        const collectionPDA = this.findPetCollectionPDA();
        const nftMint = this.findPetNftPDA(userPetId);
        const metadataPDA = this.findMetadataPDA(nftMint);
        const masterEditionPDA = this.findMasterEditionPDA(nftMint);
        const tokenAccount = await spl.getAssociatedTokenAddress(nftMint, user.publicKey);
        const collectionMetadataPDA = this.findMetadataPDA(collectionPDA);
        const collectionMasterEditionPDA = this.findMasterEditionPDA(collectionPDA);

        const modifyComputeUnits = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 40_0000 });
        const method = this.program.methods.petMint(this.petCollectionMatadata.name, userPetId, Array.from(signature)).accounts({
            user: user.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            petAccount: this.findPetAccountPDA(),
            collectionMint: collectionPDA,
            collectionMetadataAccount: collectionMetadataPDA,
            collectionMasterEdition: collectionMasterEditionPDA,
            nftMint,
            metadataAccount: metadataPDA,
            masterEdition: masterEditionPDA,
            tokenAccount: tokenAccount,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        return await this.exec([user], this.getEdIx(signer, message, signature), modifyComputeUnits, await method.transaction());
    }

    async lendingInitialize(admin: Keypair, price: BN) {
        const method = this.program.methods.lendingInitialize(price).accounts({
            admin: admin.publicKey,
            lendingAccount: this.findLendingAccountPDA(),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return await this.exec([admin], await method.transaction());
    }

    async initializeVault(admin: Keypair, mint: PublicKey) {
        let vaultPDA = this.findVaultTokenAccountPDA(mint);
        const method = this.program.methods.lendingInitializeVault().accounts({
            admin: admin.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            vaultAccount: vaultPDA,
            tokenMint: mint,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        });
        return await this.exec([admin], await method.transaction());
    }

    async lendingUpdate(admin: Keypair, price: BN) {
        const method = this.program.methods.lendingUpdate(price).accounts({
            admin: admin.publicKey,
            lendingAccount: this.findLendingAccountPDA(),
            systemProgram: SystemProgram.programId,
        });
        return await this.exec([admin], await method.transaction());
    }

    getFeed() {
        //https://docs.chain.link/data-feeds/price-feeds/addresses?network=solana&page=2
        return this.getNetworkName() == "mainnet" ? "CH31Xns5z3M1cTAbKW34jcxPPciazARpijcHj9rxtemt" : "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
    }

    async lendingBorrow(user: Keypair, gkeplMint: PublicKey, solAmount: BN) {
        const method = this.program.methods.lendingBorrow(solAmount).accounts({
            user: user.publicKey,
            lendingAccount: this.findLendingAccountPDA(),
            solVaultAccount: this.findSolValultAccountPDA(),
            vaultTokenAccount: this.findVaultTokenAccountPDA(gkeplMint),
            userAccount: this.findLendingUserAccountPDA(user.publicKey),
            tokenMint: gkeplMint,
            userTokenAccount: await spl.getAssociatedTokenAddress(gkeplMint, user.publicKey),
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            chainlinkFeed: this.getFeed(),
            chainlinkProgram: this.CHAINLINK_PROGRAM_ID,
        });
        // return await method.signers([user]).rpc();
        return this.exec([user], await method.transaction());
    }

    async lendingRepay(user: Keypair, gkeplMint: PublicKey, tokenAmount: BN) {
        const method = this.program.methods.lendingRepay(tokenAmount).accounts({
            user: user.publicKey,
            lendingAccount: this.findLendingAccountPDA(),
            solVaultAccount: this.findSolValultAccountPDA(),
            vaultTokenAccount: this.findVaultTokenAccountPDA(gkeplMint),
            userAccount: this.findLendingUserAccountPDA(user.publicKey),
            tokenMint: gkeplMint,
            userTokenAccount: await spl.getAssociatedTokenAddress(gkeplMint, user.publicKey),
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            chainlinkFeed: this.getFeed(),
            chainlinkProgram: this.CHAINLINK_PROGRAM_ID,
        });
        // return await method.signers([user]).rpc();
        return this.exec([user], await method.transaction());
    }

    async emergencyWithdrawSol(user: Keypair, to: PublicKey, amount: BN) {
        const method = this.program.methods.emergencyWithdrawSol(amount).accounts({
            admin: user.publicKey,
            solVaultAccount: this.findSolValultAccountPDA(),
            xbotAccount: this.findXbotAccountPDA(),
            recipientAccount: to,
            systemProgram: SystemProgram.programId,
        });
        return this.exec([user], await method.transaction());
    }

    async emergencyWithdrawToken(admin: Keypair, mint: PublicKey, to: PublicKey, amount: BN) {
        const method = this.program.methods.emergencyWithdrawToken(amount).accounts({
            admin: admin.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            tokenMint: mint,
            vaultTokenAccount: this.findVaultTokenAccountPDA(mint),
            userTokenAccount: spl.getAssociatedTokenAddressSync(mint, to),
            recipientAccount: to,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
        });
        // return method.signers([user]).rpc();
        return this.exec([admin], await method.transaction());
    }

    async initializeXbot(admin: Keypair, signer: PublicKey) {
        const method = this.program.methods.initializeXbot(signer).accounts({
            admin: admin.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        // return await method.signers([admin]).rpc();

        return this.exec([admin], await method.transaction());
    }

    async landUpgrade(
        user: Keypair,
        targetLevel: BN,
        currency: PublicKey,
        price: BN,
        referrer: PublicKey,
        feeTo: PublicKey,
        signer: PublicKey,
        message: Uint8Array,
        signature: Uint8Array
    ) {
        const vaultTokenAccount = spl.getAssociatedTokenAddressSync(currency, feeTo);
        const userTokenAccount = spl.getAssociatedTokenAddressSync(currency, user.publicKey);
        const method = this.program.methods.landUpgrade(targetLevel, currency, price, referrer, Array.from(signature)).accounts({
            user: user.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            landUserAccount: this.findLandUserAccountPDA(user.publicKey),
            vaultTokenAccount,
            userTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        // return method.signers([user]).rpc();
        return this.exec([user], this.getEdIx(signer, message, signature), await method.transaction());
    }

    async petUpgrade(
        user: Keypair,
        userPetId: BN,
        targetLevel: BN,
        currency: PublicKey,
        price: BN,
        referrer: PublicKey,
        feeTo: PublicKey,
        signer: PublicKey,
        message: Uint8Array,
        signature: Uint8Array
    ) {
        const vaultTokenAccount = spl.getAssociatedTokenAddressSync(currency, feeTo);
        const userTokenAccount = spl.getAssociatedTokenAddressSync(currency, user.publicKey);
        const method = this.program.methods.petUpgrade(userPetId, targetLevel, currency, price, referrer, Array.from(signature)).accounts({
            user: user.publicKey,
            xbotAccount: this.findXbotAccountPDA(),
            vaultTokenAccount,
            userTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        return this.exec([user], this.getEdIx(signer, message, signature), await method.transaction());
    }
}
