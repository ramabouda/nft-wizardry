"use client";

import {
  SismoConnectResponse,
  SismoConnectVerifiedResult
} from "@sismo-core/sismo-connect-react";
import { useState } from "react";

export default function Home() {
  const [sismoConnectVerifiedResult, setSismoConnectVerifiedResult] =
    useState<SismoConnectVerifiedResult>();
  const [sismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse>();
  const [pageState, setPageState] = useState<string>("init");
  const [error, setError] = useState<string>("");

  // TODO: check is logged in

  // TODO: fetch NFTs on RPC

}

