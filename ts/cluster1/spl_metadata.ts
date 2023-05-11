import { Keypair, Connection, Commitment, PublicKey, sendAndConfirmTransaction, Transaction, SystemProgram } from "@solana/web3.js";
import { createMint, getMint, getOrCreateAssociatedTokenAccount, getAccount, mintTo } from '@solana/spl-token';
import { DataV2, createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wba-wallet.json";

// Import our keypair from the wallet file
const payer = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const mint = new PublicKey("6mGYMqMGWK9CBwpfynLkBTtTMHiJTREp1W2rbQDouRX6");

const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

const [metadata_pda, _ ] = PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), token_metadata_program_id.toBuffer(), mint.toBuffer()],
    token_metadata_program_id
  );


(async () => {
    try {
        const create_metadata = createCreateMetadataAccountV3Instruction(
            {
                metadata: metadata_pda,
                mint,
                mintAuthority: payer.publicKey,
                payer: payer.publicKey,
                updateAuthority: payer.publicKey,
                systemProgram: SystemProgram.programId,
            },
            {
                createMetadataAccountArgsV3 : {
                    data: {
                        name: "Test",
                        symbol: "TST",
                        uri: "https://hzwmf3kaqtw7lxhmlitjhwwubzdcdz5b5dvvlqg4yjma7lbbv6sq.arweave.net/PmzC7UCE7fXc7Fomk9rUDkYh56Ho61XA3MJYD6whr6U",
                        sellerFeeBasisPoints: 550,
                        creators: [ { address: payer.publicKey, verified: true, share: 100 } ],
                        collection: null,
                        uses: null
                    },
                    isMutable: true,
                    collectionDetails: null
                }
            },
            token_metadata_program_id
        )
        const tx = await sendAndConfirmTransaction(
            connection,
            new Transaction().add(create_metadata),
            [payer],
            { commitment }
        )
        console.log(tx)

        } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()