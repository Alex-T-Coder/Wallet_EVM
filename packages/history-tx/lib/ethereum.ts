import { ETH_DECIMAL, EthereumInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { EthTxs, EthTxDataType } from "./types";

export default class EthereumTxs extends EthereumInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getTransactionData(hash: string) {
    const data = await this.ethConnect.getTransactionData(hash);
    const txType = (txAddr: string) => {
      if (txAddr === this.ethConnect.getAddress()) return "SEND | ETH";
      else return "RECEIVE | ETH";
    };
    const resTxData: EthTxDataType = {
      transaction_hash: data.hash,
      from: data.from[0].from,
      value: (
        Number(data.from[0].amount.amount()) / Math.pow(10, ETH_DECIMAL)
      ).toFixed(ETH_DECIMAL),
      to: data.to[0].to,
      date: data.date.toUTCString(),
      transfer_type: txType(data.from[0].from),
    };
    return resTxData;
  }

  async getTransactionsHistory(
    address: string,
    offset?: number,
    limit?: number,
    startTime?: Date
  ) {
    const txs = await this.ethConnect.getTransactions({
      address,
      limit,
      offset,
      startTime,
    });
    if (txs.total > 0) {
      const txType = (txAddr: string) => {
        if (txAddr === address) return "SEND | ETH";
        else return "RECEIVE | ETH";
      };
      let txsResult: Array<EthTxDataType> = [];
      txs.txs.map((res) => {
        const resTx: EthTxDataType = {
          transaction_hash: res.hash,
          from: res.from[0].from,
          value: (
            Number(res.from[0].amount.amount()) / Math.pow(10, ETH_DECIMAL)
          ).toFixed(ETH_DECIMAL),
          to: res.to[0].to,
          date: res.date.toUTCString(),
          transfer_type: txType(res.from[0].from),
        };
        txsResult.push(resTx);
      });
      const result: EthTxs = {
        total: txs.total,
        txs: txsResult,
      };
      return result;
    } else {
      return null;
    }
  }
}
