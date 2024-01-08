import { Keypair, Connection, clusterApiUrl, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers"

const PING_PROGRAM_ADDRESS = new PublicKey('ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa')
const PING_PROGRAM_DATA_ADDRESS =  new PublicKey('Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod')

const payer = getKeypairFromEnvironment('SECRET_KEY')
const connection = new Connection(clusterApiUrl('devnet'))

sendPingTransaction(connection, payer).catch(err => console.log(err));

async function sendPingTransaction(connection: Connection, payer: Keypair) {
    const transaction = new Transaction();

    const programId = new PublicKey(PING_PROGRAM_ADDRESS);
    const pingProgramDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS);

    const instruction = new TransactionInstruction({
        keys: [
            { pubkey: pingProgramDataId, isSigner: false, isWritable: true }
        ],
        programId,
    });

    transaction.add(instruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);

    // console.log(`✅ Transaction completed! Signature is ${signature}`);
    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)
}