import { NetworkType } from "@dojima-wallet/types";
import { PolkaClient } from "@dojima-wallet/connection";

export default class PolkadotAccount extends PolkaClient {
  constructor(mnemonic: string, network: NetworkType, provider?: string) {
    super(mnemonic, network, provider);
  }

  // Get public address using seed phrase
  async getAddress(): Promise<string> {
    const address = this._client.getAddress();
    return address;
  }

  // Retrieve balance of the user
  async getBalance(pubAddress: string): Promise<number> {
    const balance = await this._client.getBalance(pubAddress);
    return balance;
  }
}
