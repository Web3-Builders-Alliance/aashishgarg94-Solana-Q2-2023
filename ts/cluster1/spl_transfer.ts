import { Keypair, Connection, Commitment, PublicKey } from "@solana/web3.js";
import { createMint, getMint, getOrCreateAssociatedTokenAccount, getAccount, mintTo, transfer } from '@solana/spl-token';
import wallet from "./wba-wallet.json";

// Import our keypair from the wallet file
const fromWallet = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const mint = new PublicKey("6mGYMqMGWK9CBwpfynLkBTtTMHiJTREp1W2rbQDouRX6");

(async () => {
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    )

    const to = new PublicKey("EunFLT2tekFrZxK6NszC2PbRTNmwExNrqrjJsBNcMwjN");

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        to
    )

    const fromTokenAccountInfo_initial = await getAccount(
        connection,
        fromTokenAccount.address
    )

    console.log(fromTokenAccountInfo_initial.amount);

    const signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        50
    );

    const fromTokenAccountInfo = await getAccount(
        connection,
        fromTokenAccount.address
    )
    const toTokenAccountInfo = await getAccount(
        connection,
        toTokenAccount.address
    )
    console.log(fromTokenAccountInfo.amount);
    console.log(toTokenAccountInfo.amount);
})()