import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
  } from "@solana/web3.js";
  import "dotenv/config"
  import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
  
  const suppliedToPubkey = process.argv[2] || null;
  
  if (!suppliedToPubkey) {
    console.log(`Please provide a public key to send to`);
    process.exit(1);
  }

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
  const beforeSenderBalance = await connection.getBalance(senderKeypair.publicKey);
  console.log(`BEFORE: Sender has a balance of ${beforeSenderBalance} lamports`);
  
  console.log(`suppliedToPubkey: ${suppliedToPubkey}`);
  
  const toPubkey = new PublicKey(suppliedToPubkey);
  
  
  console.log(
    `✅ Loaded our own keypair, the destination public key, and connected to Solana`
  );

  const transaction = new Transaction;

  const LAMPORTS_TO_SEND = 5000;

  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: LAMPORTS_TO_SEND,
  });

  transaction.add(sendSolInstruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

  console.log(`Finished! Sent ${LAMPORTS_TO_SEND} lamports to ${toPubkey.toBase58()}`);
  console.log(`Transaction signature: ${signature}`);

  const afterSenderBalance = await connection.getBalance(senderKeypair.publicKey);
  console.log(`AFTER: Sender has a balance of ${afterSenderBalance} lamports`);
  console.log(`Actually sent: ${beforeSenderBalance - afterSenderBalance} lamports`)