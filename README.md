# nft-wizardry

NFT integration and community rewards of a card gaming app. Card NFT gift for first-time users, incorporating a sybil-resistant login mechanism with Sismo. No-fee NFT minting on ImmutableX.

## Description

This project is a low-cost card gaming application built on Immutable X, providing a very affordable gaming experience. The use of Immutable X is strategic, as it allows for free NFT minting. Consider a card game where each player uses 100 cards - if a single NFT were to cost 20 cents, each player would end up paying $20 just for the cards. Our solution drastically reduces these costs, providing a more accessible gaming experience.
While our game app offers a free NFT per user, to avoid sybil attack we are utilizing Sismo's social login feature to mitigate this risk. It also verifies users by means of well known SNS, giving other players peace of mind knowing that other players on the platform are SNS-verified users.

## Next steps

### More Sismo claims

We check for a twitter account using Sismo, but the protection could be improved by adding a Sismo claim:

- For early project supporters: by using a claim on a group of twitter followers
- For users with buying power: require a minimum ETH balance

### Persistency

The server stores the used EVM accounts & twitter accounts in-memory, we could easily add a minimal datastore persisted on disk.
