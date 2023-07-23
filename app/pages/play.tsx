"use client";

import {
  Config,
  ImmutableX,
  createStarkSigner,
  generateStarkPrivateKey,
} from "@imtbl/core-sdk";
import {
  ImmutableAssetStatus,
  ImmutableMethodResults,
  ImmutableXClient,
} from "@imtbl/imx-sdk";
import { Card, Grid, Loading, Text } from "@nextui-org/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { User } from "./api/login";


const apiAddress = "https://api.sandbox.x.immutable.com/v1";
const COLLECTION_CONTRACT_ADDRESS =
  "0x8f97A06A3F290c11934fC40627D1D9aB20c2E52d";

// Starting Immutable Client
const config = Config.SANDBOX; // Or PRODUCTION
const client = new ImmutableX(config);

async function ensureIsRegistered(user: User) {
  // Check the user is registered
  try {
    await client.getUser(user.address);
  } catch (err: any) {
    if (err.code === "account_not_found") {
      console.log("User not found, registering");

      // Create Stark signer
      const starkPrivateKey = generateStarkPrivateKey(); // Or retrieve previously generated key
      const starkSigner = createStarkSigner(starkPrivateKey);

      // Create Ethereum signer
      const ethNetwork = "goerli"; // Or 'mainnet'
      const provider = new ethers.providers.Web3Provider(
        // @ts-ignore
        window.ethereum,
        ethNetwork
      );
      await provider.send("eth_requestAccounts", []);
      const ethSigner = provider.getSigner();

      // Register.
      const walletConnection = { ethSigner, starkSigner };

      await client.registerOffchain(walletConnection);
    }
  }
}

export default function Play() {
  const [nfts, setNfts] =
    useState<ImmutableMethodResults.ImmutableGetAssetsResult | null>(null);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchNfts();
  }, []); // The empty dependency array ensures the effect runs only once

  const getFreeMint = async () => {
    await ensureIsRegistered(user!);

    setIsMinting(true);
    const mintResult = await fetch("/api/free-mint", {
      method: "POST",
    });

    // Wait for the metadata to load.
    await new Promise((r) => setTimeout(r, 10 * 1000));

    // Refresh all nfts.
    await fetchNfts();
    setIsMinting(false);
    await getUser(); // Update user.
  };

  const fetchNfts = async (): Promise<void> => {
    try {
      const nfts = await getListAssets(COLLECTION_CONTRACT_ADDRESS);

      // Are the metadata correct?
      const isReady = nfts.result.every((nft) => Boolean(nft.metadata));
      if (!isReady) {
        // Wait and retry.
        await new Promise((r) => setTimeout(r, 10 * 1000));
        return await fetchNfts();
      }

      setNfts(nfts);
    } catch (error) {
      console.error("Error fetching nfts:", error);
    }
  };

  const getUser = async () => {
    const result = await fetch("/api/user", {
      method: "GET",
    });
    const userJson = await result.json();
    setUser(userJson);
    return userJson;
  };

  const getListAssets = async (collectionAddress: string) => {
    const { address } = await getUser();

    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });

    const nfts = await client.getAssets({
      user: address,
      status: ImmutableAssetStatus.imx,
      collection: collectionAddress,
    });
    console.log("nfts", nfts);
    return nfts;
  };

  return (
    <>
      <h1>NFT Wizardry</h1>

      {!user?.didFreeMint ? (
        isMinting ? (
          <div style={{ textAlign: "center" }}>
            <Loading
              type="spinner"
              size="lg"
              color="primary"
              textColor="primary"
            />
            Minting...
          </div>
        ) : (
          <button className="play" onClick={getFreeMint}>
            GIMME A FREEBEE
          </button>
        )
      ) : (
        <div style={{ textAlign: "center" }}>No more free mint!</div>
      )}

      <div>
        {nfts ? (
          <Grid.Container gap={2}>
            {nfts.result.map((nft) => (
              <Grid xs={4} key={nft.token_id}>
                <Card>
                  <Card.Header>
                    <Text>
                      <h4>{nft.name}</h4>
                    </Text>
                  </Card.Header>
                  <Card.Image src={nft.image_url!} alt={nft.image_url!} />
                  <Card.Body>
                    <Text>{nft.description}</Text>
                  </Card.Body>
                  <Card.Footer>
                    <Text>
                      {(nft.metadata as any).class}:{" "}
                      {(nft.metadata as any).attack} attack
                    </Text>
                  </Card.Footer>
                </Card>
              </Grid>
            ))}
          </Grid.Container>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </>
  );
}
