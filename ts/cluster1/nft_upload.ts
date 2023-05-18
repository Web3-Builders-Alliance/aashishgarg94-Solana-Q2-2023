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
        const image = await readFile('./images/felina_cliff.png');
        const metaplex_image = toMetaplexFile(image, "felina_over_a_cliff.png");
        const uri = await metaplex.storage().upload(metaplex_image);
        console.log(uri);
    } catch (e) {
        console.log(e);
    }
})();