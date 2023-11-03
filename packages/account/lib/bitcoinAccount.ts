// import { Network } from "@dojima-wallet/types";
// import { BitcoinInit } from "@dojima-wallet/connection";
// import { AssetBTC, baseToAsset } from "@dojima-wallet/utils";
//
// export default class BitcoinAccount extends BitcoinInit {
//   constructor(mnemonic: string, network: Network) {
//     super(mnemonic, network);
//   }
//
//   getAddress(): string {
//     const address = this.btcConnect.getAddress();
//     return address;
//   }
//
//   async getBalance(address: string): Promise<number> {
//     const balArr = await this.btcConnect.getBalance(address, [AssetBTC]);
//     const balance = baseToAsset(balArr[0].amount).amount().toNumber();
//     return balance;
//   }
// }
