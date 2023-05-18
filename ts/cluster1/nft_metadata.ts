import { Connection, Keypair } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from '@metaplex-foundation/js';
import wallet from './wba-wallet.json';
import { readFile } from 'fs/promises';

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair)).use(bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: "https://api.devnet.solana.com",
        timeout: 60000
}));

(async () => {
    try {
        const { uri } = await metaplex.nfts().uploadMetadata({
            name: "Felina over a cliff",
            symbol: "FELINA_ON_CLIFF",
            description: "Felina jumping over a cliff looking cool",
            image: "https://arweave.net/k9e7KdD3QEZGau9UI69IoBQu1a4Ei13EvzI9bQQKk6Q",
            attributes: [],
            properties: {
                files: [
                    {
                        uri: "https://arweave.net/k9e7KdD3QEZGau9UI69IoBQu1a4Ei13EvzI9bQQKk6Q",
                        type: "image/png"
                    }
                ]
            },
            sellerFeeCollection: {
                account: keypair.publicKey.toBase58(),
                amount: 500
            },
            sellerFeeBasisPoints: 500,
            creators: [
                {
                    address: keypair.publicKey.toBase58(),
                    verified: true,
                    share: 100
                }
            ],
            is_mutible: true
        });
        console.log(uri);
    } catch (e) {
        console.log(e);
    }
})();