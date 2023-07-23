import { AlchemyProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Config, ImmutableX } from "@imtbl/core-sdk";
import "dotenv/config";
import fs from "fs";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "./helpers/session";
import { User } from "./login";

// Create Ethereum signer
const ethNetwork = "goerli"; // Or 'mainnet'
const provider = new AlchemyProvider(ethNetwork, process.env.ALCHEMY_API_KEY);
const ethSigner = new Wallet(process.env.PRIVATE_KEY || "").connect(provider);

// Starting Immutable Client
const config = Config.SANDBOX; // Or PRODUCTION
const client = new ImmutableX(config);

// Using in-memory storage, but we should use a real DB later.
const evmAccountsFreeMintUsed: any = [];
const twitterAccountsFreeMintUsed: any = [];

function readMetadataFile(filePath: string) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error: any) {
    throw new Error("Error reading or parsing JSON file: " + error.message);
  }
}

export function hadFreeMint(user: User) {
  return (
    evmAccountsFreeMintUsed.find(
      (usedAddress: any) => usedAddress === user.address
    ) ??
    twitterAccountsFreeMintUsed.find(
      (usedTwitterId: string) => usedTwitterId === user.twitterId
    )
  );
}

const getMintId = async () => {
  const response = await client.listAssets({
    collection: process.env.COLLECTION_CONTRACT_ADDRESS!,
  });
  return (response.result.length + 1).toString();
};

async function mintTo(address: string) {
  const mintId = await getMintId();
  const metadata = await readMetadataFile("../nft/metadata/" + mintId);
  const mintRequest = {
    contract_address: process.env.COLLECTION_CONTRACT_ADDRESS!,
    users: [
      {
        user: address,
        tokens: [
          {
            // Specific NFT token
            id: mintId,
            blueprint: JSON.stringify(metadata),
          },
        ],
      },
    ],
  };

  console.log("mintRequest", mintRequest);

  const mintResponse = await client.mint(ethSigner, mintRequest);

  console.log("mintResponse", mintResponse);
  return mintResponse.results;
}

// this is the API route that is called by the SismoConnectButton
async function route(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user) return;

  try {
    if (hadFreeMint(user)) {
      throw new Error("You already had free NFTs, you bad boy!");
    }

    const mintResult = await mintTo(user.address);

    // No more free mints!
    evmAccountsFreeMintUsed.push(user.address);
    twitterAccountsFreeMintUsed.push(user.twitterId);
    req.session.user!.didFreeMint = true;
    await req.session.save();

    return res.status(200).json(mintResult);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json(e.message);
  }
}

export default withIronSessionApiRoute(route, sessionOptions);
