import { readFileSync } from "fs";
import { Keypair, Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL, BlockheightBasedTransactionConfirmationStrategy } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, getAccount, getMint } from "@solana/spl-token";


export async function ftMint(connection: Connection, keypair: Keypair) {
  const mint = await createMint(connection, keypair, keypair.publicKey, keypair.publicKey, 9);
  console.log(`FT Mint address: ${mint.toBase58()}`);

  let mintInfo = await getMint(connection, mint);
  console.log(`Mint total supply: ${mintInfo.supply}`);

  const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

  await mintTo(connection, keypair, mint, associatedTokenAccount.address, keypair.publicKey, 1000000000);

  let account = await getAccount(connection, associatedTokenAccount.address);
  console.log(`Token account balance: ${account.amount}`);

  mintInfo = await getMint(connection, mint);
  console.log(`Updated mint total supply: ${mintInfo.supply}`);
}

export async function nftMint(connection: Connection, keypair: Keypair) {
  // Create mint
  const mint = await createMint(connection, keypair, keypair.publicKey, null, 0);
  console.log(`NFT Mint address: ${mint.toBase58()}`);

  // Create associated token account to mint to
  const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
  console.log(`Associated token account: ${associatedTokenAccount.address.toBase58()} with balance ${associatedTokenAccount.amount}`);

  // Actually mint the tokens to the new associated token account
  const mintAmount = 1;
  console.log(`Minting ${mintAmount} tokens to ${associatedTokenAccount.address.toBase58()}`)
  await mintTo(connection, keypair, mint, associatedTokenAccount.address, keypair, 1);

  // Verify the balance
  let account = await getAccount(connection, associatedTokenAccount.address);
  console.log(`Token account balance: ${account.amount}`);
}

/**
 * Gets local dev keypair. If less than one SOL balance is found, request an airdrop.
 */
export async function getLocalWallet(connection: Connection) {
  // console.log(`TOTAL SOL SUPPLY: ${(await connection.getSupply()).value.total}`);

  // let localKeypair = new PublicKey(getLocalKeypair());
  const localKeypair = getLocalKeypair();
  console.log("Local keypair: ", localKeypair.publicKey.toBase58());

  // console.log("Getting new keypair...");
  // let payer = Keypair.generate();

  let myBalance = await connection.getBalance(localKeypair.publicKey);

  // If I have less than 1 SOL, get airdrop
  if (myBalance < LAMPORTS_PER_SOL) {
    console.log("Getting airdrop...");
    const airdropSignature = await connection.requestAirdrop(localKeypair.publicKey, LAMPORTS_PER_SOL);
    const latestBlockHeight = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      signature: airdropSignature,
      lastValidBlockHeight: latestBlockHeight.lastValidBlockHeight,
      blockhash: latestBlockHeight.blockhash
    });
    myBalance = await connection.getBalance(localKeypair.publicKey);
  }

  console.log("My balance: ", myBalance);

  return localKeypair;
}

function getLocalKeypair() {
    // Path to your id.json file
    const keypairFilePath = `${process.env.HOME}/.config/solana/id.json`;

    // Read the keypair file
    const keypairJson = readFileSync(keypairFilePath, { encoding: 'utf8' });

    // Parse the JSON and create a Keypair instance
    const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairJson)));

    // Example: Output the public key of the loaded keypair
    console.log('Public Key:', keypair.publicKey.toBase58());

    return keypair;
}
