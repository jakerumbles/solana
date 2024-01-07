import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

import { getDomainKeySync, NameRegistryState, getAllDomains, performReverseLookup } from "@bonfida/spl-name-service";

// const publicKey = getKeypairFromEnvironment("SECRET_KEY").publicKey;

const suppliedPublicKey = process.argv[2];
if (!suppliedPublicKey) {
    throw new Error("Public key not supplied");
}

const publicKey = new PublicKey(suppliedPublicKey);
if (!PublicKey.isOnCurve(publicKey)) throw new Error("Invalid public key");

console.log(`Supplied public key: ${publicKey}`);

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const connection = new Connection("https://omniscient-yolo-patina.solana-mainnet.quiknode.pro/55da2fdf6b7479fb12fd7de65fae8d5fa70823b2/", "confirmed");

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(`The balance for the wallet at address ${publicKey} is ${balanceInSOL} SOL`);

getPublicKeyFromSolDomain("bonfida");

async function getPublicKeyFromSolDomain(domain: string): Promise<void> {
    try {
        const { pubkey } = getDomainKeySync(domain);
        console.log(`Returned pubkey: ${pubkey.toBase58()}`);

        const { registry, nftOwner } = await NameRegistryState.retrieve(connection, pubkey);
        if (nftOwner === null || nftOwner === undefined) {
            throw new Error("No owner found");
        }

        console.log(`The owner of SNS Domain: ${domain} is: ${nftOwner.toBase58()}`);
    } catch (error) {
        console.error("Error:", error);
    }
}
