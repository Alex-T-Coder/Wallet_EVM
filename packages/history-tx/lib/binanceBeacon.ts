import { BinanceBeaconInit, BNB_DECIMAL } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { BnbTxs, BnbTxDataType } from "./types";

export default class BinanceBeaconTxs extends BinanceBeaconInit {
  protected isTestnet = false;
  // protected isStagenet = false;
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
    if (network === Network.Testnet) this.isTestnet = true;
    // if (network === Network.Stagenet) this.isStagenet = true;
  }

  async getTransactionData(hash: string) {
    if (this.isTestnet) {
      return null;
    } else {
      const data = await this.bnbBConnect.getTransactionData(hash);
      const txType = (txAddr: string) => {
        if (txAddr === this.bnbBConnect.getAddress()) return "SEND | BNB";
        else return "RECEIVE | BNB";
      };
      const resTxData: BnbTxDataType = {
        transaction_hash: data.hash,
        from: data.from[0].from,
        value: (
          Number(data.from[0].amount.amount()) / Math.pow(10, BNB_DECIMAL)
        ).toFixed(BNB_DECIMAL),
        to: data.to[0].to,
        date: data.date.toUTCString(),
        transfer_type: txType(data.from[0].from),
      };
      return resTxData;
    }
  }

  async getTransactionsHistory(
    address: string,
    offset?: number,
    limit?: number,
    startTime?: Date
  ) {
    if (this.isTestnet) {
      return null;
    } else {
      const txs = await this.bnbBConnect.getTransactions({
        address,
        limit,
        offset,
        startTime,
      });
      if (txs.txs.length > 0) {
        const txType = (txAddr: string) => {
          if (txAddr === address) return "SEND | BNB";
          else return "RECEIVE | BNB";
        };
        let txsResult: Array<BnbTxDataType> = [];
        txs.txs.map((res) => {
          const resTx: BnbTxDataType = {
            transaction_hash: res.hash,
            from: res.from[0].from,
            value: (
              Number(res.from[0].amount.amount()) / Math.pow(10, BNB_DECIMAL)
            ).toFixed(BNB_DECIMAL),
            to: res.to[0].to,
            date: res.date.toUTCString(),
            transfer_type: txType(res.from[0].from),
          };
          txsResult.push(resTx);
        });
        const result: BnbTxs = {
          total: txsResult.length,
          txs: txsResult,
        };
        return result;
      } else {
        return null;
      }
    }
  }
}
