import { Network } from "@dojima-wallet/types";
import { BinanceBeaconInit } from "@dojima-wallet/connection";
import { AssetBNB, baseToAsset } from "@dojima-wallet/utils";

export default class BinanceBeaconAccount extends BinanceBeaconInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  getAddress(): string {
    const address = this.bnbBConnect.getAddress();
    return address;
  }

  async getBalance(address: string): Promise<number> {
    const balArr = await this.bnbBConnect.getBalance(address, [AssetBNB]);
    const balance = baseToAsset(balArr[0].amount).amount().toNumber();
    return balance;
  }
}
