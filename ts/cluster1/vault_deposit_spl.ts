import { Connection, Keypair, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { WbaVault, IDL } from "./programs/wba_vault";
import wallet from "./wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<WbaVault>(IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address, provider);

const vaultInit = new PublicKey("EyVgnqkFxkKGGNafpCGdFKABFLDdT2mvKSaTZtkLDM87");

const auth_seeds = [Buffer.from("auth"), vaultInit.toBuffer()];
const vault_auth = PublicKey.findProgramAddressSync(auth_seeds, program.programId)[0];
console.log(`Vault auth key: ${vault_auth.toBase58()}`)

const enrollment_seeds = [Buffer.from("vault"), vault_auth.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);

const mint = new PublicKey("6mGYMqMGWK9CBwpfynLkBTtTMHiJTREp1W2rbQDouRX6");

(async () => {
    try {
        const ownerAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )

        const vaultAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            vault_auth,
            true
        )

        const txhash = await program.methods
        .depositSpl(new BN (100000))
        .accounts({
            owner: keypair.publicKey,
            ownerAta: ownerAta.address,
            vaultState: vaultInit,
            vaultAuth: vault_auth,
            vaultAta: vaultAta.address,
            tokenMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId
        })
        .signers([
            keypair
        ]).rpc();

        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();