import { Network } from "@dojima-wallet/types";
import { SolanaInit } from "@dojima-wallet/connection";

export default class SolanaTxs extends SolanaInit {
  constructor(mnemonic: string, network: Network, apiKey?: string) {
    super(mnemonic, network, apiKey);
  }

  async getTransactionData(hash: string) {
    const data = await this.solConnect.getTransactionData(hash);
    return data;
  }

  async getTransactionsHistory(
    address: string,
    limit?: number,
    beforeHash?: string,
    untilHash?: string
  ) {
    const txs = await this.solConnect.getTransactionsHistory({
      address,
      offset: limit,
      beforeHash,
      untilHash,
    });
    return txs;
  }
}
