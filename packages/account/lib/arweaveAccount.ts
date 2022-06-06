import { NetworkType } from "@dojima-wallet/types";
import { getKeyFromMnemonic } from "arweave-mnemonic-keys";
import { ArweaveInitialise } from "@dojima-wallet/connection";

export default class ArweaveAccount extends ArweaveInitialise {
  constructor(network: NetworkType) {
    super(network);
  }

  async getAddress(mnemonic: string): Promise<string> {
    // Get 'public address' from Seed phrase
    const key = await getKeyFromMnemonic(mnemonic);
    const address = await this._arweave.wallets.jwkToAddress(key);
    return address;
  }

  async mintArTokens(pubAddress: string) {
    // testnet tokens in winston
    const test_ar_amount = 5000000000000;

    // Mint balance in Arlocal for testing
    await this._arweave.api.get(`/mint/${pubAddress}/${test_ar_amount}`);
    await this._arweave.api.get("/mine");
  }
}
