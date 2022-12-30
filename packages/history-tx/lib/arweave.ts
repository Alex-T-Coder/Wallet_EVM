import { Network } from "@dojima-wallet/types";
import { ArweaveInit } from "@dojima-wallet/connection";

export default class ArweaveTxs extends ArweaveInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getTransactionData(hash: string) {
    const data = await this.arConnect.getTransactionData(hash);
    return data;
  }

  async getTransactionsHistory(address: string, limit?: number) {
    const txs = await this.arConnect.getTransactionsHistory({
      address,
      limit,
    });
    return txs;
  }
}
