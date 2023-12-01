import { SolanaInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";

export default class SolanaAccount extends SolanaInit {
  constructor(mnemonic: string, network: Network, apiKey?: string) {
    super(mnemonic, network, apiKey);
  }

  async getAddress(): Promise<string> {
    const address = this.solConnect.getAddress();
    return address;
  }

  async getBalance(address: string): Promise<number> {
    const balance = await this.solConnect.getBalance(address);
    return balance;
  }
}
