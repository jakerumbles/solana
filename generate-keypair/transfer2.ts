import { Keypair, Connection, clusterApiUrl, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction, SystemInstruction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers"

let payer: Keypair = getKeypairFromEnvironment('SECRET_KEY');
const connection = new Connection(clusterApiUrl('devnet'));

const transaction = new Transaction();

const toPubkey = new Keypair().publicKey;

const sol_transfer_ix = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey,
    lamports: LAMPORTS_PER_SOL * 1,
});

transaction.add(sol_transfer_ix);

const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);

console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)
