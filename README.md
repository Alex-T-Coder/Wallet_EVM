# Dojima wallet npm packages.

Npm packages are written to support dojima-wallet UI.

Below are the list of packages available:

- @dojima-wallet/types
- @dojima-wallet/connection
- @dojima-wallet/account
- @dojima-wallet/transfer
- @dojima-wallet/non-native
- @dojima-wallet/history-tx
- @dojima-wallet/prices
- @dojima-wallet/eth-protocols
- @dojima-wallet/solana-protocols
- @dojima-wallet/utils
- @dojima-wallet/security

## Description

Wallet-js is a lerna repository which allows to manage multiple npm packages. This repo contains packages to create accounts, transfer tokens, get balance from layer1, layer2 blockchains. Currently supported blockchains are Dojima, Ethereum, Solana, Polkadot, Binance, Polygon, Arweave e.t.c

## Types package

This package contains globally required packages like network type e.t.c

## Connection package

This package is used for creating blockchain instances which is useful for blockchain functionalities to create, transfer, balance functionalities.

## Account package

This package is used for creating accounts to layer1 blockchains like arweave, solana, evm chains.

## Transfer package

This package is used for quering balance, transfer tokens to blockchains.

## Non-native package

This package is used for querying non-native token functionalities for multiple blockchains like ethereum - USDT, USDC, BNB, UNI; Arweave - ArDrive, Verto.

## History-tx package

This package is used for retreiving history transactions for user of supported blockchains like ethereum, binance, solana, polkadot, arweave.

## Prices

This package is used for retreiving current price, timeline statistics of token for layer1 blockchains.

## Eth-protocols

This package is used for interacting with dojima smart contract which interacts with ethereum famous protocols such as Aave, Compound, Curve, Uniswap, Shushiswap e.t.c

## Solana-protocols

This package is used for interacting with dojima solana programs which interacts with solana famous protocols such as orca, radyium e.t.c

## Utils

This package contains utilities which requrired for other dojima wallet packages.

## Security

This package helps in encode/decode the user seed data from local-storage.
