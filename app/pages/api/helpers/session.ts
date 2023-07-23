import { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password:
    "TEST_PWD___TEST_PWD___TEST_PWD___TEST_PWD___TEST_PWD___TEST_PWD___",
  cookieName: "nft-wizardry",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
