import { Network } from "@dojima-wallet/types";
import { ArweaveInit } from "@dojima-wallet/connection";

export default class ArweaveAccount extends ArweaveInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getAddress(): Promise<string> {
    const address = await this.arConnect.getAddress();
    return address;
  }

  async getBalance(address: string): Promise<number> {
    const balance = await this.arConnect.getBalance(address);
    return balance;
  }
}
