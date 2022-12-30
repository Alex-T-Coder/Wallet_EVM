import { Network } from "@dojima-wallet/types";
import { PolkadotInit } from "@dojima-wallet/connection";

export default class PolkadotAccount extends PolkadotInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getAddress(): Promise<string> {
    const address = this.dotConnect.getAddress();
    return address;
  }

  async getBalance(address: string): Promise<number> {
    const balance = await this.dotConnect.getBalance(address);
    return balance;
  }
}
