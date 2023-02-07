import { HermesInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { AssetDOJNative, baseToAsset } from "@dojima-wallet/utils";

export default class HermesAccount extends HermesInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  getAddress(): string {
    const address = this.h4sConnect.getAddress();
    return address;
  }

  async getBalance(address: string): Promise<number> {
    const balArr = await this.h4sConnect.getBalance(address, [AssetDOJNative]);
    const balance = baseToAsset(balArr[0].amount).amount().toNumber();
    return balance;
  }
}
