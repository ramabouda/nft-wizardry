"use client";

import {
  ImmutableAssetStatus,
  ImmutableMethodResults,
  ImmutableXClient,
} from "@imtbl/imx-sdk";
import { Card, Grid, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";

const apiAddress = "https://api.sandbox.x.immutable.com/v1";
const COLLECTION_CONTRACT_ADDRESS =
  "0x8f97A06A3F290c11934fC40627D1D9aB20c2E52d";

const getListAssets = async (collectionAddress: string) => {
  const { address } = await getUser();

  const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });

  const nfts = await client.getAssets({
    user: address,
    status: ImmutableAssetStatus.imx,
    collection: collectionAddress,
  });
  console.log(nfts);
  return nfts
};

const getUser = async () => {
  const verifiedResult = await fetch("/api/user", {
    method: "GET",
  });
  return await verifiedResult.json();
};

export default function Play() {
  const [nfts, setNfts] =
    useState<ImmutableMethodResults.ImmutableGetAssetsResult | null>(null);

  useEffect(() => {
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once

  const fetchData = async () => {
    try {
      const result = await getListAssets(COLLECTION_CONTRACT_ADDRESS);
      setNfts(result);
    } catch (error) {
      console.error("Error fetching nfts:", error);
    }
  };

  return (
    <>
      <h1>NFT Wizardry</h1>
      <div>
        {nfts ? (
          <Grid.Container gap={2}>
            {nfts.result.map((nft) => (
              <Grid xs={4} key={nft.token_id}>
                <Card>
                  <Card.Header>
                    <Text><h4>{nft.name}</h4></Text>
                  </Card.Header>
                  <Card.Image src={nft.image_url!} alt={nft.image_url!} />
                  <Card.Body>
                    <Text>{nft.description}</Text>
                  </Card.Body>
                  <Card.Footer>
                  <Text>{(nft.metadata as any).class}: {(nft.metadata as any).attack} attack</Text>
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
