// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AuthType, SismoConnect, SismoConnectVerifiedResult } from "@sismo-core/sismo-connect-server";
import { NextResponse } from "next/server";
import { AUTHS, CLAIMS, CONFIG, SIGNATURE_REQUEST } from "../../sismo-connect-config.ts";
import { ClientReferenceManifestPlugin } from "next/dist/build/webpack/plugins/flight-manifest-plugin";
import { ImmutableX, Config } from '@imtbl/core-sdk';

const sismoConnect = SismoConnect({ config: CONFIG });

const usedVaultIds: any = [];

// this is the API route that is called by the SismoConnectButton
export async function POST(req: Request) {
  const sismoConnectResponse = await req.json();

  try {
    const result: SismoConnectVerifiedResult = await sismoConnect.verify(sismoConnectResponse, {
      auths: AUTHS,
      claims: CLAIMS,
      signature: SIGNATURE_REQUEST,
    });

    // Vault ID

    const vaultProof = sismoConnectResponse.proofs.find((proof : any) => proof.auths[0].authType === AuthType.VAULT);
    const vaultUserId = vaultProof.auths[0].userId
    console.log('vaultUserId', vaultUserId);
   
    const existingVaultId = usedVaultIds.find((vaultId: any) => vaultId ===  vaultUserId)
    if (existingVaultId) {
      throw new Error('You already had free NFTs, you bad boy!')
    }

    // TODO: Mint 3 nfts, send to user, save wallet address to avoid sybil attack
    // Starting Immutable Client 

    const config = Config.SANDBOX; // Or PRODUCTION
    const client = new ImmutableX(config);
   
    // mint response, check (working / failing) , send results to FE 

    // Vault Storage

    usedVaultIds.push(vaultUserId);

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(e.message, { status: 500 });
  }
}
