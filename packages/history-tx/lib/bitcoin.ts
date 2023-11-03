// import { BitcoinInit, BTC_DECIMAL } from "@dojima-wallet/connection";
// import { Network } from "@dojima-wallet/types";
// import { BtcTxs, BtcTxDataType } from "./types";
//
// export default class BitcoinTxs extends BitcoinInit {
//   constructor(mnemonic: string, network: Network) {
//     super(mnemonic, network);
//   }
//
//   async getTransactionData(hash: string) {
//     const data = await this.btcConnect.getTransactionData(hash);
//     const txType = (txAddr: string) => {
//       if (txAddr === this.btcConnect.getAddress()) return "SEND | BTC";
//       else return "RECEIVE | BTC";
//     };
//     const resTxData: BtcTxDataType = {
//       transaction_hash: data.hash,
//       from: data.from[0].from,
//       value: (
//         Number(data.from[0].amount.amount()) / Math.pow(10, BTC_DECIMAL)
//       ).toFixed(BTC_DECIMAL),
//       to: data.to[0].to,
//       date: data.date.toUTCString(),
//       transfer_type: txType(data.from[0].from),
//     };
//     return resTxData;
//   }
//
//   async getTransactionsHistory(
//     address: string,
//     offset?: number,
//     limit?: number,
//     startTime?: Date
//   ) {
//     const txs = await this.btcConnect.getTransactions({
//       address,
//       limit,
//       offset,
//       startTime,
//     });
//     if (txs.txs.length > 0) {
//       const txType = (txAddr: string) => {
//         if (txAddr === address) return "SEND | BTC";
//         else return "RECEIVE | BTC";
//       };
//       let txsResult: Array<BtcTxDataType> = [];
//       txs.txs.map((res) => {
//         const resTx: BtcTxDataType = {
//           transaction_hash: res.hash,
//           from: res.from[0].from,
//           value: (
//             Number(res.from[0].amount.amount()) / Math.pow(10, BTC_DECIMAL)
//           ).toFixed(BTC_DECIMAL),
//           to: res.to[0].to,
//           date: res.date.toUTCString(),
//           transfer_type: txType(res.from[0].from),
//         };
//         txsResult.push(resTx);
//       });
//       const result: BtcTxs = {
//         total: txsResult.length,
//         txs: txsResult,
//       };
//       return result;
//     } else {
//       return null;
//     }
//   }
// }
