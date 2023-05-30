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
        const nft = metaplex.nfts().create({
            name: "Generug Aashish",
            symbol: "GENAASH",
            uri: "https://arweave.net/7Z6uBOQa_WcqxSmIael6znzS3zHKOFmgbdQ6R2tMzJw",
            creators: [
                {
                    address: keypair.publicKey,
                    share: 100
                }],
            sellerFeeBasisPoints: 500,
            isMutable: true
        });
        console.log((await nft).nft.address.toBase58());
    } catch (e) {
        console.log(e);
    }
})();