import { readFileSync } from "fs";
import {
  Keypair,
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  BlockheightBasedTransactionConfirmationStrategy,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
  getMint,
} from "@solana/spl-token";
import { ftMint, getLocalWallet, nftMint } from "./splToken";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplCandyMachine,
  create,
} from "@metaplex-foundation/mpl-candy-machine";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
// import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";

async function main() {
  let connection = new Connection("http://127.0.0.1:8899", "confirmed");
  console.log(`✅ Connected to ${connection.rpcEndpoint}`);

  let localKeypair = await getLocalWallet(connection);

  // NFT mint
  // await nftMint(connection, localKeypair);

  // Fungible token mint
  // await ftMint(connection, localKeypair);

  const umi = createUmi("http://127.0.0.1:8899").use(mplCandyMachine());

  // Add the local wallet to the Umi instance as the signer.
  const myKeypair = umi.eddsa.createKeypairFromSecretKey(
    localKeypair.secretKey
  );
  const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);
  umi.use(keypairIdentity(myKeypairSigner));

  console.log(`Umi signer: ${umi.identity.publicKey}`);

  // const wallet = useWallet();
  // umi.use(walletAdapterIdentity(wallet))

  // Create the Collection NFT.
  const collectionUpdateAuthority = generateSigner(umi);
  const collectionMint = generateSigner(umi);

  try {
    console.log("Creating collection mint...");
    await createNft(umi, {
      mint: collectionMint,
      authority: collectionUpdateAuthority,
      name: "My Collection NFT",
      uri: "https://arweave.net/yfVoS8kmFiM_XjfZOETgdCfrByKDyheSJ20nyam8_ag",
      sellerFeeBasisPoints: percentAmount(5.0, 2), // 9.99%
      isCollection: true,
    }).sendAndConfirm(umi);
  } catch (error) {
    console.error(error);
  }

  console.log("Collection mint address: ", collectionMint.publicKey);

  // Create the Candy Machine.
  // const candyMachine = generateSigner(umi)
  // const createInstructions = await create(umi, {
  //   candyMachine,
  //   collectionMint: collectionMint.publicKey,
  //   collectionUpdateAuthority,
  //   tokenStandard: TokenStandard.NonFungible,
  //   sellerFeeBasisPoints: percentAmount(5.00, 2), // 9.99%
  //   itemsAvailable: 500,
  //   creators: [
  //     {
  //       address: umi.identity.publicKey,
  //       verified: true,
  //       percentageShare: 100,
  //     },
  //   ],
  //   configLineSettings: some({
  //     prefixName: '',
  //     nameLength: 32,
  //     prefixUri: '',
  //     uriLength: 200,
  //     isSequential: false,
  //   }),
  // });

  // await transactionBuilder().add(createInstructions).sendAndConfirm(umi);
}

main()
  .then(() => {
    console.log("");
  })
  .catch((error) => {
    console.error(error);
  });
