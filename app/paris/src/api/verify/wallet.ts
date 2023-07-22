import {
    ENVIRONMENTS,
    L1_PROVIDERS,
    WalletSDK,
  } from '@imtbl/wallet-sdk-web';

  function setupCoreSDKWorkflows(): Workflows {
    const coreSdkConfig = getConfig({
      coreContractAddress: '0x7917eDb51ecD6CdB3F9854c3cc593F33de10c623',
      registrationContractAddress: '0x1C97Ada273C9A52253f463042f29117090Cd7D83',
      chainID: 5, // Goerli
      basePath: 'https://api.sandbox.x.immutable.com',
    });
  
    return new Workflows(coreSdkConfig);
  }
  
  (async () => {
    // Builds the Wallet SDK object
    const sdk = await WalletSDK.build({
      env: ENVIRONMENTS.STAGING,
      /*
        RPC config is only required if the WalletConnect provider (L1_PROVIDERS.WALLET_CONNECT)
        is being used. Follow this reference for the RPC config:
        https://docs.walletconnect.com/quick-start/dapps/web3-provider#provider-options
      */
    //   rpc: {
    //     5: 'https://goerli.mycustomnode.com',
    //   },
      /*
        Will switch the chain based on this configured chainID when connecting to the wallet.(Optional)
        Following the table below to get the chainID and name mapping. 
        Consult https://chainlist.org/ for more.
        ChainId   | Network
        --- --- | --- --- 
        1       | Ethereum Main Network (Mainnet)
        5       | Goerli Test Network
      */
    //   chainID: 5,
    });
  
    // Connects on the chosen provider - WalletConnect
    const walletConnection = await sdk.connect({ provider: L1_PROVIDERS.WALLET_CONNECT });
    // For Metamask:
    // const walletConnection = await sdk.connect({ provider: L1_PROVIDERS.METAMASK });
  
    // Register the user using the Core SDK
    await setupCoreSDKWorkflows.registerOffchain(walletConnection);
  })();

   // Mint 3 NFTs
   const mintResponse = await client.mint({
    // Will replace with a new contract address
    "contractAddress": "0xe8aBAD333c6B90C4Fa58490B26385ABbcb23A675",
    // Specifying contract-wide royalty information
    "royalties": [
      {
        // Specifying the contract-wide royalty recipient's wallet address
        "recipient": "0x6201df57Cb9f15B1232cF333a78926A303f6Bbac",
        // Specifying the contract-wide royalty rate for this collection
        // "percentage": 2.5
      }
    ],
    "users": [
      {
        "etherKey": "0xc3ec7590d5970867ebd17bbe8397500b6ae5f690",
        "tokens": [
          {
            // Specific NFT token
            "id": "1",
            "blueprint": "my-on-chain-metadata",
            // Overriding the contract-wide royalty information with token-specific royalty information
            "royalties": [
              {
                // Same recipient's wallet address
                "recipient": "0x6201df57Cb9f15B1232cF333a78926A303f6Bbac",
                // Changed royalty rate for this specific token (i.e. 1% instead of the default 2.5%)
                // "percentage": 1
              }
            ],
          }
        ]
      },
      {
        "etherKey": "0xA91E927148548992f13163B98be47Cf4c8Cb3B16",
        "tokens": [
          {
            // Specific NFT token
            // No token-specific royalty information specified; contract-wide royalty infromation will be used
            "id": "2",
            "blueprint": "my-other-on-chain-metadata"
          }
        ]
      },
      ...
    ]
  });

