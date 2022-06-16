import { NetworkType } from "@dojima-wallet/types";
import { BtcClient } from "@dojima-wallet/connection";

export default class BitcoinAccount extends BtcClient {
  constructor(network: NetworkType) {
    super(network);
  }

  // Get public address using seed phrase
  getAddress(mnemonic: string): string {
    const address = this._client.getAddress(mnemonic);
    return address;
  }

  // Retrieve balance of the user
  async getBalance(pubAddress: string): Promise<number> {
    const balance = await this._client.getBalance(pubAddress);
    return balance;
  }
}
