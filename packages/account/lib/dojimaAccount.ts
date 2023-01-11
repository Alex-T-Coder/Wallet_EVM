import { DojimaInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";

export default class DojimaAccount extends DojimaInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  getAddress(): string {
    const address = this.dojConnect.getAddress();
    return address;
  }

  async getBalance(address: string): Promise<number> {
    const balance = await this.dojConnect.getBalance(address);
    return balance;
  }
}
