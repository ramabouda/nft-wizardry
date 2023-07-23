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
import { hadFreeMint as didFreeMint } from "./free-mint.ts";
import { sessionOptions } from "./helpers/session.ts";

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

export type User = {
  isLoggedIn: boolean;
  address: string;
  twitterId: string;
  didFreeMint: boolean;
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
    const userEvmAddress = evmAccountProof.auths[0].userId;
    console.log("user address:", userEvmAddress);

    const twitterAccountProof = sismoConnectResponse.proofs.find(
      (proof: any) => proof.auths[0].authType === AuthType.TWITTER
    );
    const userTwitterId = twitterAccountProof.auths[0].userId;
    console.log("user twitter:", userTwitterId);

    // Start Iron session.
    const user = {
      isLoggedIn: true,
      address: userEvmAddress,
      twitterId: userTwitterId,
      didFreeMint: didFreeMint(userEvmAddress),
    };
    req.session.user = user;
    await req.session.save();
    return res.status(200).json({ sismoVerifiedResult, user });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json(e.message);
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
