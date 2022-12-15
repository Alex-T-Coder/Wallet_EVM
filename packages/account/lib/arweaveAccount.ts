import { NetworkType } from "@dojima-wallet/types";
import { ArweaveInitialise } from "@dojima-wallet/connection";
import { ApiConfig } from "arweave/node/lib/api";
import { getKeyFromMnemonic } from "arweave-mnemonic-keys";

export default class ArweaveAccount extends ArweaveInitialise {
  constructor(network: NetworkType, config?: ApiConfig) {
    super(network, config);
  }

  async getAddress(mnemonic: string): Promise<string> {
    const keyPair = await getKeyFromMnemonic(mnemonic);
    const address = await this._arweave.wallets.jwkToAddress(keyPair);
    return address;
  }

  /** testnet tokens in winston */
  async mintArTokens(address: string) {
    const test_ar_amount = 2000000000000;

    // Mint balance in Arlocal for testing
    await this._arweave.api.get(`/mint/${address}/${test_ar_amount}`);
    await this._arweave.api.get("/mine");
  }

  async getBalance(address: string): Promise<number> {
    /** Get balance */
    const wnstBalance = await this._arweave.wallets.getBalance(address);

    /** Convert balance from Winston to Ar. (1 Ar = 10^12) */
    const arBalance = this._arweave.ar.winstonToAr(wnstBalance);

    return Number(arBalance);
  }
}
