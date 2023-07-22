// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "./login";

// this is the API route that is called by the SismoConnectButton
async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(req.session.user);
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
