import { EthereumInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { EthTxDataType, EthTxs } from "./types";
// import { EthTxs, EthTxDataType, EthTxDataRes, EthTxsRes } from "./types";
// import axios from "axios";

export default class EthereumTxs extends EthereumInit {
  protected isTestnet = false;
  // protected isStagenet = false;
  constructor(mnemonic: string, network: Network, apiKey?: string) {
    super(mnemonic, network, apiKey);
    if (network === Network.Testnet) this.isTestnet = true;
    // if (network === Network.Stagenet) this.isStagenet = true;
  }

  async getTransactionData(hash: string): Promise<EthTxDataType> {
    const data = await this.ethConnect.getTransactionData(hash);
    if (data) {
      return {
        transfer_type:
          data.from === this.ethConnect.getAddress()
            ? "Send | ETH"
            : "Receive | ETH",
        transaction_hash: data.transaction_hash,
        from: data.from,
        to: data.to,
        amount: data.amount,
        gas_fee: data.gasFee,
        block_number: data.block_number,
        block_hash: data.block_hash,
        gas_price: data.gasPrice,
        nonce: data.nonce,
      };
    } else {
      throw Error(`Unable to retrieve data`);
    }
  }

  async getTransactionsHistory(
    address: string,
    offset?: number,
    limit?: number,
    startBlock?: number,
    endBlock?: number
  ): Promise<EthTxs> {
    if (this.isTestnet) {
      return null;
    } else {
      try {
        const txs = await this.ethConnect.getTransactionsHistory({
          address,
          apiKey: "J19V58VEVM69RDGJHNH69M42F2J4BFDVIV",
          limit: limit ? limit : undefined,
          page: offset ? offset : undefined,
          startBlock: startBlock ? startBlock : undefined,
          endBlock: endBlock ? endBlock : undefined,
        });
        return txs;
      } catch (e) {
        throw Error(`Unable to retrieve txs`);
      }
    }
  }

  // remove0x(string: string) {
  //   return string.startsWith("0x") ? string.substring(2) : string;
  // }
  //
  // convertHexToInt(hexValue: string) {
  //   return parseInt(hexValue, 16);
  // }
  //
  // async getTransactionData(hash: string): Promise<EthTxDataType> {
  //   let url: string;
  //   if (this.ethConnect.getNetwork() === Network.Mainnet) {
  //     url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=6IU4JG5P2PNVRSB54YIAMIAQFQ879PXJ7C`;
  //   } else {
  //     url = `https://api-goerli.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=6IU4JG5P2PNVRSB54YIAMIAQFQ879PXJ7C`;
  //   }
  //   const data = await axios.get(url);
  //   if (data.status !== 200) {
  //     throw new Error(`Unable to retrieve data.`);
  //   } else {
  //     const result: EthTxDataRes = data.data.result;
  //     return {
  //       transfer_type:
  //         result.from === this.ethConnect.getAddress()
  //           ? "Send | ETH"
  //           : "Receive | ETH",
  //       from: result.from,
  //       to: result.to,
  //       transaction_hash: result.hash,
  //       value: (
  //         this.convertHexToInt(this.remove0x(result.value)) / Math.pow(10, 18)
  //       ).toFixed(18),
  //     };
  //   }
  //   // const data = await this.ethConnect.getTransactionData(hash);
  //   // const txType = (txAddr: string) => {
  //   //   if (txAddr === this.ethConnect.getAddress()) return "SEND | ETH";
  //   //   else return "RECEIVE | ETH";
  //   // };
  //   // const resTxData: EthTxDataType = {
  //   //   transaction_hash: data.hash,
  //   //   from: data.from[0].from,
  //   //   value: (
  //   //     Number(data.from[0].amount.amount()) / Math.pow(10, ETH_DECIMAL)
  //   //   ).toFixed(ETH_DECIMAL),
  //   //   to: data.to[0].to,
  //   //   date: data.date.toUTCString(),
  //   //   transfer_type: txType(data.from[0].from),
  //   // };
  //   // return resTxData;
  // }
  //
  // async getTransactionsHistory(
  //   address: string,
  //   offset?: number,
  //   limit?: number
  //   // startTime?: Date
  // ) {
  //   let url: string;
  //   if (this.ethConnect.getNetwork() === Network.Mainnet) {
  //     url = `https://api.etherscan.io/api?module=account&action=txlist&sort=desc&apiKey=6IU4JG5P2PNVRSB54YIAMIAQFQ879PXJ7C&address=${address}&page=${
  //       offset ? offset : 1
  //     }&offset=${limit ? limit : 10}`;
  //   } else {
  //     url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&sort=desc&apiKey=6IU4JG5P2PNVRSB54YIAMIAQFQ879PXJ7C&address=${address}&page=${
  //       offset ? offset : 1
  //     }&offset=${limit ? limit : 10}`;
  //   }
  //   const data = await axios.get(url);
  //   if (data.status !== 200) {
  //     throw new Error(`Unable to retrieve txs.`);
  //   } else {
  //     const dataResult: Array<EthTxsRes> = data.data.result;
  //     if (dataResult.length > 0) {
  //       let txsResult: Array<EthTxDataType> = [];
  //       dataResult.map((res) => {
  //         const resTx: EthTxDataType = {
  //           block: res.blockNumber,
  //           transfer_type:
  //             res.from === this.ethConnect.getAddress()
  //               ? "Send | ETH"
  //               : "Receive | ETH",
  //           from: res.from,
  //           to: res.to,
  //           transaction_hash: res.hash,
  //           value: (Number(res.value) / Math.pow(10, ETH_DECIMAL)).toFixed(
  //             ETH_DECIMAL
  //           ),
  //           gas_price: (
  //             Number(res.gasPrice) / Math.pow(10, ETH_DECIMAL)
  //           ).toFixed(ETH_DECIMAL),
  //           date: new Date(Number(res.timeStamp) * 1000).toUTCString(),
  //         };
  //         txsResult.push(resTx);
  //       });
  //       const result: EthTxs = {
  //         total: txsResult.length,
  //         txs: txsResult,
  //       };
  //       return result;
  //     } else {
  //       return null;
  //     }
  //   }
  // }
  //   const txs = await this.ethConnect.getTransactions({
  //     address,
  //     limit,
  //     offset,
  //     startTime,
  //   });
  //   if (txs.txs.length > 0) {
  //     const txType = (txAddr: string) => {
  //       if (txAddr === address) return "SEND | ETH";
  //       else return "RECEIVE | ETH";
  //     };
  //     let txsResult: Array<EthTxDataType> = [];
  //     txs.txs.map((res) => {
  //       const resTx: EthTxDataType = {
  //         transaction_hash: res.hash,
  //         from: res.from[0].from,
  //         value: (
  //           Number(res.from[0].amount.amount()) / Math.pow(10, ETH_DECIMAL)
  //         ).toFixed(ETH_DECIMAL),
  //         to: res.to[0].to,
  //         date: res.date.toUTCString(),
  //         transfer_type: txType(res.from[0].from),
  //       };
  //       txsResult.push(resTx);
  //     });
  //     const result: EthTxs = {
  //       total: txsResult.length,
  //       txs: txsResult,
  //     };
  //     return result;
  //   } else {
  //     return null;
  //   }
  // }
}
