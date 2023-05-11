import { Keypair, Connection, Commitment, PublicKey } from "@solana/web3.js";
import { createMint, getMint, getOrCreateAssociatedTokenAccount, getAccount, mintTo } from '@solana/spl-token';
import wallet from "./wba-wallet.json";

// Import our keypair from the wallet file
const payer = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const mint = new PublicKey("6mGYMqMGWK9CBwpfynLkBTtTMHiJTREp1W2rbQDouRX6");

(async () => {
    try {
        const mintInfo = await getMint(
            connection,
            mint
          )

          const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
          )

          const tokenAccountInfo = await getAccount(
            connection,
            tokenAccount.address
          )
          
          console.log(tokenAccountInfo.amount);

          await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            payer.publicKey,
            1000000000
          )

          const mintInfo_new = await getMint(
            connection,
            mint
          )
          
          console.log(mintInfo_new.supply);
          // 100
          
          const tokenAccountInfo_new = await getAccount(
            connection,
            tokenAccount.address
          )
          
          console.log(tokenAccountInfo_new.amount);
          
          console.log(tokenAccount.address.toBase58());

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()