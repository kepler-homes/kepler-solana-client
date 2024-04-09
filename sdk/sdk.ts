import * as anchor from "@coral-xyz/anchor";
import { Program, BN, EventParser, BorshCoder, AnchorProvider, Provider } from "@coral-xyz/anchor";
import { Xbot, IDL } from "../target/types/xbot";
import { Keypair, PublicKey, Connection, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as spl from "@solana/spl-token";
import { Metadata, PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { Metaplex } from "@metaplex-foundation/js";
import { hexToBytes, padLeft } from "web3-utils";

export class XbotClient {
    public connection: Connection;
    public program: Program<Xbot>;
    public metaplex: Metaplex;
    public eventParser: EventParser;
    public endpoint: string;

    public gkeplTokenMatadata = {
        name: "Xbot gToken",
        symbol: "gKEPL",
        uri: "https://solana-api.xbot.homes/api/metadata/gkepl",
    };

    public keplTokenMatadata = {
        name: "Xbot Token",
        symbol: "KEPL",
        uri: "https://solana-api.xbot.homes/api/metadata/kepl",
    };

    public petCollectionMatadata = {
        name: "Xbot Bot Collection",
        symbol: "KEPLBC",
        uri: "https://solana-api.xbot.homes/api/metadata/collection",
    };

    public static programId: string = "Ac65CKN49nxHiB9HaKw7HwYT3wLynSRVy51AN9yNAafN";

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

    findGkeplTokenPDA() {
        return this.findTokenPDA(this.gkeplTokenMatadata.name);
        // return PublicKey.findProgramAddressSync([Buffer.from("gkepl")], this.program.programId)[0];
    }

    findTokenPDA(name: string) {
        return PublicKey.findProgramAddressSync([Buffer.from(name)], this.program.programId)[0];
    }

    findKeplTokenPDA() {
        return this.findTokenPDA(this.keplTokenMatadata.name);
    }

    findPetCollectionPDA() {
        return this.findTokenPDA(this.petCollectionMatadata.name);
    }

    findLendingAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Lending")], this.program.programId)[0];
    }

    findGlobalAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Global")], this.program.programId)[0];
    }

    findPetAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Pet")], this.program.programId)[0];
    }

    findLandAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Land")], this.program.programId)[0];
    }

    findLendingValultAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("LendingVault")], this.program.programId)[0];
    }

    findLendingUserAccountPDA(user: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from("LendingUser"), user.toBuffer()], this.program.programId)[0];
    }

    findClaimUserAccountPDA(tokenName: string, user: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from("ClaimUser"), Buffer.from(tokenName), user.toBuffer()], this.program.programId)[0];
    }

    findLandUserAccountPDA(user: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from("LandUser"), user.toBuffer()], this.program.programId)[0];
    }

    async queryLendingAccount() {
        return await this.program.account.lendingAccount.fetchNullable(this.findLendingAccountPDA());
    }

    async queryPetAccount() {
        return await this.program.account.petAccount.fetchNullable(this.findPetAccountPDA());
    }

    async queryGlobalAccount() {
        return await this.program.account.globalAccount.fetchNullable(this.findGlobalAccountPDA());
    }

    async queryLendingUserAccount(user: PublicKey) {
        const pda = this.findLendingUserAccountPDA(user);
        return await this.program.account.lendingUserAccount.fetchNullable(pda);
    }

    async queryClaimUserAccount(tokenName: string, user: PublicKey) {
        const pda = this.findClaimUserAccountPDA(tokenName, user);
        return await this.program.account.claimUserAccount.fetchNullable(pda);
    }

    getSolAmountByTokenAmount(borrowPrice: BN, tokenAmount: BN) {
        // let mut sol_amount = token_amount * ctx.accounts.lending_account.price * 100 / 85 / 1_000_000 * 1000;
        return tokenAmount.mul(borrowPrice).mul(new BN(100)).div(new BN(85)).div(new BN(1_000_000)).mul(new BN(1000));
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

    async queryGkeplTokenMetadata() {
        return this.queryTokenMetadata(this.gkeplTokenMatadata.name);
        // const tokenMintPDA = this.findGkeplTokenPDA();
        // const metadataPDA = this.metaplex.nfts().pdas().metadata({ mint: tokenMintPDA });
        // return await this.queryMetadata(metadataPDA);
    }

    async queryTokenMetadata(name: string) {
        const tokenMintPDA = this.findTokenPDA(name);
        const metadataPDA = this.metaplex.nfts().pdas().metadata({ mint: tokenMintPDA });
        return await this.queryMetadata(metadataPDA);
    }

    async queryKeplTokenMetadata() {
        return this.queryTokenMetadata(this.keplTokenMatadata.name);
        // const tokenMintPDA = this.findKeplTokenPDA();
        // const metadataPDA = this.metaplex.nfts().pdas().metadata({ mint: tokenMintPDA });
        // return await this.queryMetadata(metadataPDA);
    }

    bnToBytes(b: BN) {
        return hexToBytes(padLeft(b.toBuffer().toString("hex"), 8 * 2));
    }

    async createToken(admin: Keypair, name: string, symbol: string, uri: string) {
        const tokenMintPDA = this.findTokenPDA(name);
        const metadataPDA = this.metaplex.nfts().pdas().metadata({ mint: tokenMintPDA });
        const method = this.program.methods.createToken(name, symbol, uri).accounts({
            admin: admin.publicKey,
            globalAccount: this.findGlobalAccountPDA(),
            metadataAccount: metadataPDA,
            tokenMint: tokenMintPDA,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });

        // return method.signers([admin]).rpc();
        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [admin], { skipPreflight: true });
    }

    async mintToken(admin: Keypair, tokenName: string, to: PublicKey, amount: BN) {
        const tokenMintPDA = this.findTokenPDA(tokenName);
        let tokenAccount = await spl.getOrCreateAssociatedTokenAccount(this.connection, admin, tokenMintPDA, to);
        const method = this.program.methods.mintToken(tokenName, amount).accounts({
            user: admin.publicKey,
            globalAccount: this.findGlobalAccountPDA(),
            tokenMint: tokenMintPDA,
            tokenAccount: tokenAccount.address,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
        });
        // return method.signers([admin]).rpc();
        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [admin], { skipPreflight: true });
    }

    async getTokenBalance(tokenName: string, user: PublicKey) {
        const tokenMintPDA = this.findTokenPDA(tokenName);
        let tokenAccount = spl.getAssociatedTokenAddressSync(tokenMintPDA, user);
        try {
            return (await this.connection.getTokenAccountBalance(tokenAccount)).value;
        } catch (err) {
            return {};
        }
    }

    async getKeplBalance(user: PublicKey) {
        return this.getTokenBalance(this.keplTokenMatadata.name, user);
    }

    async getGkeplBalance(user: PublicKey) {
        return this.getTokenBalance(this.gkeplTokenMatadata.name, user);
    }

    async mintKepl(payer: Keypair, to: PublicKey, amount: BN) {
        return await this.mintToken(payer, this.keplTokenMatadata.name, to, amount);
    }

    async mintGkepl(payer: Keypair, to: PublicKey, amount: BN) {
        return await this.mintToken(payer, this.gkeplTokenMatadata.name, to, amount);
    }

    async createGkeplToken(payer: Keypair) {
        const { name, symbol, uri } = this.gkeplTokenMatadata;
        return await this.createToken(payer, name, symbol, uri);
    }

    async createKeplToken(payer: Keypair) {
        const { name, symbol, uri } = this.keplTokenMatadata;
        return await this.createToken(payer, name, symbol, uri);
    }

    async createCollection(admin: Keypair, name: string, symbol: string, uri: string) {
        const collectionPDA = this.findPetCollectionPDA();
        const collectionMetadataPDA = this.metaplex.nfts().pdas().metadata({ mint: collectionPDA });
        const collectionMasterEditionPDA = this.metaplex.nfts().pdas().masterEdition({ mint: collectionPDA });
        const collectionTokenAccount = await spl.getAssociatedTokenAddress(collectionPDA, admin.publicKey);
        let method = this.program.methods.createCollection(name, symbol, uri).accounts({
            authority: admin.publicKey,
            globalAccount: this.findGlobalAccountPDA(),
            collectionMint: collectionPDA,
            metadataAccount: collectionMetadataPDA,
            masterEdition: collectionMasterEditionPDA,
            tokenAccount: collectionTokenAccount,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
        });
        const modifyComputeUnits = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 40_0000 });
        const t = new anchor.web3.Transaction().add(modifyComputeUnits, await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [admin], { skipPreflight: true });
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
        // return await method.signers([admin]).rpc();
        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [admin], { skipPreflight: true });
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
            globalAccount: this.findGlobalAccountPDA(),
            vaultTokenAccount,
            userTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        // return method.signers([user]).rpc();

        const t = new anchor.web3.Transaction().add(
            anchor.web3.Ed25519Program.createInstructionWithPublicKey({
                publicKey: signer.toBytes(),
                message,
                signature,
            }),
            await method.transaction()
        );
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [user], { skipPreflight: true });
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
            globalAccount: this.findGlobalAccountPDA(),
            vaultTokenAccount,
            userTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        // return method.signers([user]).rpc();
        const t = new anchor.web3.Transaction().add(
            anchor.web3.Ed25519Program.createInstructionWithPublicKey({
                publicKey: signer.toBytes(),
                message,
                signature,
            }),
            await method.transaction()
        );
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [user], { skipPreflight: true });
    }

    findPetNftPDA(userPetId: BN) {
        return PublicKey.findProgramAddressSync([Buffer.from(this.petCollectionMatadata.name), this.bnToBytes(userPetId)], this.program.programId)[0];
    }

    async claimToken(user: Keypair, tokenName: string, claimId: BN, expireAt: BN, amount: BN, signer: PublicKey, message: Uint8Array, signature: Uint8Array) {
        const tokenMintPDA = this.findTokenPDA(tokenName);
        const edIx = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
            publicKey: signer.toBytes(),
            message,
            signature,
        });
        const method = this.program.methods.claimToken(tokenName, claimId, expireAt, amount, Array.from(signature)).accounts({
            user: user.publicKey,
            globalAccount: this.findGlobalAccountPDA(),
            tokenMint: tokenMintPDA,
            tokenAccount: spl.getAssociatedTokenAddressSync(tokenMintPDA, user.publicKey),
            userAccount: this.findClaimUserAccountPDA(tokenName, user.publicKey),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        // return method.signers([user]).rpc();
        const t = new anchor.web3.Transaction().add(edIx, await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [user], { skipPreflight: false });
    }

    async petMint(user: Keypair, userPetId: BN, signer: PublicKey, message: Uint8Array, signature: Uint8Array) {
        const collectionPDA = this.findPetCollectionPDA();
        const nftMint = this.findPetNftPDA(userPetId);
        const metadataPDA = this.findMetadataPDA(nftMint);
        const masterEditionPDA = this.findMasterEditionPDA(nftMint);
        const tokenAccount = await spl.getAssociatedTokenAddress(nftMint, user.publicKey);
        const collectionMetadataPDA = this.findMetadataPDA(collectionPDA);
        const collectionMasterEditionPDA = this.findMasterEditionPDA(collectionPDA);
        const edIx = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
            publicKey: signer.toBytes(),
            message,
            signature,
        });
        const modifyComputeUnits = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 40_0000 });
        const method = this.program.methods.petMint(this.petCollectionMatadata.name, userPetId, Array.from(signature)).accounts({
            user: user.publicKey,
            globalAccount: this.findGlobalAccountPDA(),
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

        const tx = new anchor.web3.Transaction().add(edIx, modifyComputeUnits, await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, tx, [user], { skipPreflight: false });
    }

    async lendingInitialize(admin: Keypair, price: BN) {
        const method = this.program.methods.lendingInitialize(price).accounts({
            admin: admin.publicKey,
            lendingAccount: this.findLendingAccountPDA(),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        // return await method.signers([admin]).rpc();
        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [admin], { skipPreflight: true });
    }

    async lendingUpdate(admin: Keypair, price: BN) {
        const method = this.program.methods.lendingUpdate(price).accounts({
            admin: admin.publicKey,
            lendingAccount: this.findLendingAccountPDA(),
            systemProgram: SystemProgram.programId,
        });
        // return await method.signers([admin]).rpc();
        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [admin], { skipPreflight: true });
    }

    async lendingBorrow(user: Keypair, tokenAmount: BN) {
        const tokenPDA = this.findGkeplTokenPDA();
        const mintAddress = (await this.queryGkeplTokenMetadata()).mint;
        const tokenAccount = await spl.getAssociatedTokenAddress(mintAddress, user.publicKey);
        let tokenName = this.gkeplTokenMatadata.name;
        const method = this.program.methods.lendingBorrow(tokenName, tokenAmount).accounts({
            user: user.publicKey,
            lendingAccount: this.findLendingAccountPDA(),
            vaultAccount: this.findLendingValultAccountPDA(),
            userAccount: this.findLendingUserAccountPDA(user.publicKey),
            tokenMint: tokenPDA,
            tokenAccount: tokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
        });
        // return await method.signers([user]).rpc();
        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [user], { skipPreflight: true });
    }

    async lendingRepay(user: Keypair, tokenAmount: BN) {
        const tokenPDA = this.findGkeplTokenPDA();
        const mintAddress = (await this.queryGkeplTokenMetadata()).mint;
        const tokenAccount = await spl.getAssociatedTokenAddress(mintAddress, user.publicKey);
        let tokenName = this.gkeplTokenMatadata.name;
        const method = this.program.methods.lendingRepay(tokenName, tokenAmount).accounts({
            user: user.publicKey,
            lendingAccount: this.findLendingAccountPDA(),
            vaultAccount: this.findLendingValultAccountPDA(),
            userAccount: this.findLendingUserAccountPDA(user.publicKey),
            tokenMint: tokenPDA,
            tokenAccount: tokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
        });
        // return await method.signers([user]).rpc();
        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [user], { skipPreflight: true });
    }

    async lendingEmergencyWithdraw(admin: Keypair, to: PublicKey, amount: BN) {
        const method = this.program.methods.lendingEmergencyWithdraw(amount).accounts({
            admin: admin.publicKey,
            vaultAccount: this.findLendingValultAccountPDA(),
            lendingAccount: this.findLendingAccountPDA(),
            recipientAccount: to,
            systemProgram: SystemProgram.programId,
        });
        // return await method.signers([admin]).rpc();
        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [admin], { skipPreflight: true });
    }

    async globalInitialize(admin: Keypair, signer: PublicKey) {
        const method = this.program.methods.globalInitialize(signer).accounts({
            admin: admin.publicKey,
            globalAccount: this.findGlobalAccountPDA(),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        // return await method.signers([admin]).rpc();

        const t = new anchor.web3.Transaction().add(await method.transaction());
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [admin], { skipPreflight: true });
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
            globalAccount: this.findGlobalAccountPDA(),
            landUserAccount: this.findLandUserAccountPDA(user.publicKey),
            vaultTokenAccount,
            userTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        // return method.signers([user]).rpc();

        const t = new anchor.web3.Transaction().add(
            anchor.web3.Ed25519Program.createInstructionWithPublicKey({
                publicKey: signer.toBytes(),
                message,
                signature,
            }),
            await method.transaction()
        );
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [user], { skipPreflight: true });
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
            globalAccount: this.findGlobalAccountPDA(),
            vaultTokenAccount,
            userTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        });
        // return method.signers([user]).rpc();
        const t = new anchor.web3.Transaction().add(
            anchor.web3.Ed25519Program.createInstructionWithPublicKey({
                publicKey: signer.toBytes(),
                message,
                signature,
            }),
            await method.transaction()
        );
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [user], { skipPreflight: true });
    }
}
