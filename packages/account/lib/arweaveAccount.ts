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

  async getBalance(pubAddress: string): Promise<number> {
    // Get Winston balance of an account using public address
    let wnstBalance = await this._arweave.wallets.getBalance(pubAddress);

    // Convert balance from Winston to Ar. (1 Ar = 10^12)
    const arBalance = this._arweave.ar.winstonToAr(wnstBalance);

    return Number(arBalance);
  }
}
