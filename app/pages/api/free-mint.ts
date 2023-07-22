// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { SismoConnect } from "@sismo-core/sismo-connect-server";
import { NextApiRequest, NextApiResponse } from "next";
import { CONFIG } from "../../src/sismo-connect-config.ts";

const evmAccountsFreeMintDone: any = [];

function hadFreeMint(address: string) {
  const freeMintDone = evmAccountsFreeMintDone.find(
    (vaultId: any) => vaultId === address
  );
  if (freeMintDone) {
    throw new Error("You already had free NFTs, you bad boy!");
  }

  // TODO: Mint 3 nfts, send to user, save wallet address to avoid sybil attack
  // evmAccountsFreeMintDone.push(addressId);
}
