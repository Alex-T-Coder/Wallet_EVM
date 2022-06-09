import { NetworkType } from "@dojima-wallet/types";
import {
  EthTxDataResult,
  EthTxDetailsResult,
  EthTxHashDataResult,
  EthTxsResult,
  TransactionHashDataResult,
  TransactionHistoryResult,
  TxHashDataParams,
  TxHistoryParams,
} from "./utils/types";
import axios from "axios";
import moment from "moment";
import { EthereumWeb3 } from "@dojima-wallet/connection";

export default class EthereumTransactions extends EthereumWeb3 {
  constructor(network: NetworkType) {
    super(network);
  }

  convertDateToTimestamp(date: string) {
    const timestamp = moment(date).format("X"); // lowercase 'x' for timestamp in milliseconds
    return Number(timestamp);
  }

  convertTimestampToDate(timestamp: number) {
    const date = moment(timestamp).toDate().toUTCString();
    return date;
  }

  convertISOtoUTC(date: string) {
    const utcDate = new Date(date).toUTCString();
    return utcDate;
  }

  remove0x(string: string) {
    if (string.startsWith("0x")) {
      const removed0xString = string.substring(2);
      return removed0xString;
    }
  }

  convertHexToInt(hexValue: string) {
    const intValue = parseInt(hexValue, 16);
    return intValue;
  }

  async getTransactionsHistory(params: TxHistoryParams) {
    let requestUrl = `${this._api}?module=account&action=txlist`;

    if (params.address) {
      requestUrl += `&address=${params.address}`;
    }
    if (params.apiKey) {
      requestUrl += `&api=${params.apiKey}`;
    }
    if (params.limit) {
      requestUrl += `&offset=${params.limit}`;
    } else {
      requestUrl += `&offset=10`;
    }
    if (params.page) {
      requestUrl += `&page=${params.page}`;
    } else {
      requestUrl += `&page=1`;
    }
    if (params.sort) {
      requestUrl += `&sort=${params.sort}`;
    } else {
      requestUrl += `&sort=desc`;
    }
    if (params.startBlock) {
      requestUrl += `&startblock=${params.startBlock}`;
    } else {
      requestUrl += `&startblock=0`;
    }
    if (params.endBlock) {
      requestUrl += `&endblock=${params.endBlock}`;
    } else {
      requestUrl += `&endblock=99999999`;
    }

    try {
      let response: TransactionHistoryResult = await (
        await axios.get(requestUrl)
      ).data;
      if (response.status === "1") {
        let result: EthTxDetailsResult[] = response.result;
        if (result !== (null || undefined)) {
          const resultTxs: EthTxsResult = {
            txs: result.map((res) => ({
              block: Number(res.blockNumber),
              date: moment(
                this.convertISOtoUTC(
                  this.convertTimestampToDate(Number(res.timeStamp) * 1000)
                )
              ).format("DD/MM/YYYY"),
              time: moment(
                this.convertISOtoUTC(
                  this.convertTimestampToDate(Number(res.timeStamp) * 1000)
                )
              ).format("HH:mm:ss"),
              transaction_hash: res.hash,
              contract_address:
                res.contractAddress !== "" ? res.contractAddress : "NA",
              value: Number(res.value) / Math.pow(10, 18),
              gas_price: (Number(res.gasPrice) / Math.pow(10, 18)).toFixed(9),
              from: res.from,
              transaction_type:
                res.from === params.address.toLowerCase()
                  ? "Send | ETH"
                  : "Receive | ETH",
            })),
          };
          return resultTxs;
        } else {
          return {
            txs: [],
          };
        }
      } else {
        return null;
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async getTransactionData(hash: string, apiKey: string, address: string) {
    let requestUrl = `${this._api}?module=proxy&action=eth_getTransactionByHash`;
    if (hash) {
      requestUrl += `&txhash=${hash}`;
    }
    if (apiKey) {
      requestUrl += `&api=${apiKey}`;
    }

    try {
      let response: TransactionHashDataResult = await (
        await axios.get(requestUrl)
      ).data;
      let result: EthTxHashDataResult = response.result;
      if (result !== (null || undefined)) {
        let tx_type = "";
        let etherGasPrice = Number(
          this.convertHexToInt(this.remove0x(result.gasPrice as string)) /
            Math.pow(10, 18)
        ).toFixed(18);
        let gweiGasPrice = Number(
          Number(etherGasPrice) * Math.pow(10, 9)
        ).toFixed(9);
        let type = this.remove0x(result.type);
        if (result.from === address) {
          tx_type = "Send | SOL";
        } else {
          tx_type = "Receive | SOL";
        }
        return {
          block: this.convertHexToInt(
            this.remove0x(result.blockNumber as string)
          ),
          transaction_type: tx_type,
          from: this.remove0x(result.from),
          to: this.remove0x(result.to),
          gas: this.convertHexToInt(this.remove0x(result.gas as string)),
          gas_price: `${etherGasPrice} Ether (${gweiGasPrice} Gwei)`,
          transaction_hash: result.hash,
          value:
            this.convertHexToInt(this.remove0x(result.value as string)) /
            Math.pow(10, 18),
          status:
            type === "0" ? "Success" : type === "1" ? "Pending" : "Failed",
        };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }
  async getDetailTransactionData(params: TxHashDataParams) {
    let requestUrl = `${this._api}?module=proxy&action=eth_getTransactionByHash`;
    if (params.hash) {
      requestUrl += `&txhash=${params.hash}`;
    }
    if (params.apiKey) {
      requestUrl += `&api=${params.apiKey}`;
    }

    try {
      let response: TransactionHashDataResult = await (
        await axios.get(requestUrl)
      ).data;
      let result: EthTxHashDataResult = response.result;
      if (result !== (null || undefined)) {
        const resultData: EthTxDataResult = {
          blockHash: result.blockHash,
          blockNumber: this.convertHexToInt(
            this.remove0x(result.blockNumber as string)
          ),
          from: this.remove0x(result.from),
          gas: this.convertHexToInt(this.remove0x(result.gas as string)),
          gasPrice:
            this.convertHexToInt(this.remove0x(result.gasPrice as string)) /
            Math.pow(10, 18),
          hash: result.hash,
          input: this.remove0x(result.input),
          nonce: this.convertHexToInt(this.remove0x(result.nonce as string)),
          to: this.remove0x(result.to),
          transactionIndex: this.convertHexToInt(
            this.remove0x(result.transactionIndex as string)
          ),
          value:
            this.convertHexToInt(this.remove0x(result.value as string)) /
            Math.pow(10, 18),
          type: this.remove0x(result.type),
          v: result.v,
          r: result.r,
          s: result.s,
        };
        return resultData;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }
}
