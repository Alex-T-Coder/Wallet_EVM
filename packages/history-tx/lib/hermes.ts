import { HermesInit, DOJ_DECIMAL } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { H4sTxs, H4sTxDataType } from "./types";

export default class HermesTxs extends HermesInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getTransactionData(hash: string) {
    const address = this.h4sConnect.getAddress();
    const data = await this.h4sConnect.getTransactionData(hash, address);
    const txType = (txAddr: string) => {
      if (txAddr === address) return "SEND | DOJ";
      else return "RECEIVE | DOJ";
    };
    const resTxData: H4sTxDataType = {
      transaction_hash: data.hash,
      from: data.from[data.from.length - 1].from,
      value: (
        Number(data.from[data.from.length - 1].amount.amount()) /
        Math.pow(10, DOJ_DECIMAL)
      ).toFixed(DOJ_DECIMAL),
      to: data.to[data.to.length - 1].to,
      date: data.date.toUTCString(),
      transfer_type: txType(data.from[data.from.length - 1].from),
    };
    return resTxData;
  }

  async getTransactionsHistory(
    address: string,
    offset?: number,
    limit?: number,
    startTime?: Date
  ) {
    const txs = await this.h4sConnect.getTransactions({
      address,
      limit,
      offset,
      startTime,
    });
    if (txs.txs.length > 0) {
      const txType = (txAddr: string) => {
        if (txAddr === address) return "SEND | DOJ";
        else return "RECEIVE | DOJ";
      };
      let txsResult: Array<H4sTxDataType> = [];
      txs.txs.map((res) => {
        const resTx: H4sTxDataType = {
          transaction_hash: res.hash,
          from: res.from[res.from.length - 1].from,
          value: (
            Number(res.from[res.from.length - 1].amount.amount()) /
            Math.pow(10, DOJ_DECIMAL)
          ).toFixed(DOJ_DECIMAL),
          to: res.to[res.to.length - 1].to,
          date: res.date.toUTCString(),
          transfer_type: txType(res.from[res.from.length - 1].from),
        };
        txsResult.push(resTx);
      });
      const result: H4sTxs = {
        total: txsResult.length,
        txs: txsResult,
      };
      return result;
    } else {
      return null;
    }
  }
}
