import * as anchor from "@coral-xyz/anchor";
import { Program, BN, EventParser, BorshCoder, AnchorProvider } from "@coral-xyz/anchor";
import { Kepler, IDL } from "../target/types/kepler";
import { Keypair, PublicKey, Connection, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as spl from "@solana/spl-token";
import { Metadata, PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { Metaplex } from "@metaplex-foundation/js";

export class KeplerClient {
    public connection: Connection;
    public program: Program<Kepler>;
    public metaplex: Metaplex;
    public eventParser: EventParser;
    public endpoint: string;

    public static programId: string = "2ejK6UzYJuG6w5isdpbEW7k3FCiaWH17mqGawfwC4oPD";

    public static fromEndpoint(endpoint: string) {
        const program = new Program(
            IDL,
            new PublicKey(KeplerClient.programId),
            new AnchorProvider(new Connection(endpoint), null, AnchorProvider.defaultOptions())
        );
        return new KeplerClient(program);
    }

    constructor(program: Program<Kepler>) {
        this.connection = program["_provider"].connection;
        this.program = program;
        this.metaplex = Metaplex.make(this.connection);
        this.eventParser = new EventParser(this.program.programId, new BorshCoder(this.program.idl));
        this.endpoint = this.connection["_rpcEndpoint"];
    }

    findTokenPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Token")], this.program.programId)[0];
    }

    findLendingAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("Lending")], this.program.programId)[0];
    }

    findLendingValultAccountPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from("LendingVault")], this.program.programId)[0];
    }

    findLendingUserAccountPDA(user: PublicKey) {
        return PublicKey.findProgramAddressSync([Buffer.from("LendingUser"), user.toBuffer()], this.program.programId)[0];
    }

    async queryLendingAccount() {
        return await this.program.account.lendingAccount.fetchNullable(this.findLendingAccountPDA());
    }

    async queryLendingUserAccount(user: PublicKey) {
        const pda = this.findLendingUserAccountPDA(user);
        return await this.program.account.lendingUserAccount.fetchNullable(pda);
    }

    getSolAmountByTokenAmount(borrowPrice: BN, tokenAmount: BN) {
        // let mut sol_amount = token_amount * ctx.accounts.lending_account.price * 100 / 85 / 1_000_000 * 1000;
        return tokenAmount.mul(borrowPrice).mul(new BN(100)).div(new BN(85)).div(new BN(1_000_000)).mul(new BN(1000));
    }

    parseEvents(tx: anchor.web3.VersionedTransactionResponse) {
        return this.eventParser.parseLogs(tx.meta.logMessages);
    }

    async queryMetadata(pda: PublicKey) {
        const accInfo = await this.connection.getAccountInfo(pda);
        return accInfo && Metadata.deserialize(accInfo.data, 0)[0];
    }

    async queryTokenMetadata() {
        const tokenMintPDA = this.findTokenPDA();
        const metadataPDA = await this.metaplex.nfts().pdas().metadata({ mint: tokenMintPDA });
        return await this.queryMetadata(metadataPDA);
    }

    async createToken(payer: Keypair, name: string, symbol: string, uri: string, decimals: number) {
        const tokenMintPDA = this.findTokenPDA();
        const metadataPDA = await this.metaplex.nfts().pdas().metadata({ mint: tokenMintPDA });
        const modifyComputeUnits = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 });
        const transaction = await this.program.methods
            .createToken(name, symbol, uri, decimals)
            .accounts({
                authority: payer.publicKey,
                metadataAccount: metadataPDA,
                tokenMint: tokenMintPDA,
                tokenMetadataProgram: METADATA_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
                systemProgram: SystemProgram.programId,
            })
            .transaction();
        const t = new anchor.web3.Transaction().add(modifyComputeUnits, transaction);
        return await anchor.web3.sendAndConfirmTransaction(this.connection, t, [payer], { skipPreflight: true });
    }

    findMetadataPDA(mint: PublicKey) {
        return this.metaplex.nfts().pdas().metadata({ mint });
    }

    findMasterEditionPDA(mint: PublicKey) {
        return this.metaplex.nfts().pdas().masterEdition({ mint });
    }

    async lendingInitialize(admin: Keypair, price: BN) {
        const method = this.program.methods.lendingInitialize(price).accounts({
            admin: admin.publicKey,
            lendingAccount: this.findLendingAccountPDA(),
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
        });
        return await method.signers([admin]).rpc();
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
        const tokenPDA = this.findTokenPDA();
        const mintAddress = (await this.queryTokenMetadata()).mint;
        const tokenAccount = await spl.getAssociatedTokenAddress(mintAddress, user.publicKey);
        const method = this.program.methods.lendingBorrow(tokenAmount).accounts({
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
        const tokenPDA = this.findTokenPDA();
        const mintAddress = (await this.queryTokenMetadata()).mint;
        const tokenAccount = await spl.getAssociatedTokenAddress(mintAddress, user.publicKey);
        const method = this.program.methods.lendingRepay(tokenAmount).accounts({
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
}
