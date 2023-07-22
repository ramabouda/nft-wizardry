// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AuthType, SismoConnect } from "@sismo-core/sismo-connect-server";
import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  AUTHS,
  CLAIMS,
  CONFIG,
  SIGNATURE_REQUEST,
} from "../../src/sismo-connect-config.ts";

export const sessionOptions: IronSessionOptions = {
  password:
    "TEST_PWD___TEST_PWD___TEST_PWD___TEST_PWD___TEST_PWD___TEST_PWD___",
  cookieName: "nft-wizardry",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

export type User = {
  isLoggedIn: boolean;
  vaultId: string;
  address: string;
};

const sismoConnect = SismoConnect({ config: CONFIG });

// this is the API route that is called by the SismoConnectButton
async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(400).json({ error: "POST only" });
    return;
  }

  console.log("req.body", typeof req.body);
  const sismoConnectResponse = JSON.parse(req.body);

  try {
    // Check the SISMO reponse is fine.
    const sismoVerifiedResult = await sismoConnect.verify(
      sismoConnectResponse,
      {
        auths: AUTHS,
        claims: CLAIMS,
        signature: SIGNATURE_REQUEST,
      }
    );

    // Find EVM Address.
    const evmAccountProof = sismoConnectResponse.proofs.find(
      (proof: any) => proof.auths[0].authType === AuthType.EVM_ACCOUNT
    );
    const addressId = evmAccountProof.auths[0].userId;
    console.log("user address:", addressId);

    // Start Iron session.
    const user = {
      isLoggedIn: true,
      address: addressId,
    } as User;
    req.session.user = user;
    await req.session.save();
    return res.status(200).json({ sismoVerifiedResult, user });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json(e.message);
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
