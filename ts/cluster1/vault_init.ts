import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address } from "@project-serum/anchor"
import { WbaVault, IDL } from "./programs/wba_vault";
import wallet from "./wba-wallet.json"

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<WbaVault>(IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address, provider);

const vaultInit = Keypair.generate();
console.log(`Vault init keypair: ${vaultInit.secretKey}`)
console.log(`Vault init public key: ${vaultInit.publicKey.toBase58()}`)

const auth_seeds = [Buffer.from("auth"), vaultInit.publicKey.toBuffer()];
const vault_auth = PublicKey.findProgramAddressSync(auth_seeds, program.programId)[0];
console.log(`Vault auth key: ${vault_auth.toBase58()}`)

const enrollment_seeds = [Buffer.from("vault"), vault_auth.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);

(async () => {
    try {
        const txhash = await program.methods
        .initialize()
        .accounts({
            owner: keypair.publicKey,
            vaultState: vaultInit.publicKey,
            vaultAuth: vault_auth,
            vault: enrollment_key,
            systemProgram: SystemProgram.programId
        })
        .signers([
            keypair,
            vaultInit
        ]).rpc();
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();