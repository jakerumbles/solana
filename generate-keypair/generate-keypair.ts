import { Keypair } from "@solana/web3.js";
import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");
// const keypair = Keypair.generate();

console.log(`The public key is: 0x`, keypair.publicKey.toBase58());
console.log(`The private key is: `, keypair.secretKey);

console.log(`✅ Finished! We've loaded our secret key securely, using an env file!`)