import * as web3 from "@solana/web3.js";
import { SolanaAccount } from "@dojima-wallet/account";
import { NetworkType } from "@dojima-wallet/types";
import { SolTxHistoryParams } from "./utils/types";

export default class SolanaTransactions extends SolanaAccount {
  constructor(mnemonic: string, network: NetworkType) {
    super(mnemonic, network);
  }

  async getTransactionData(hash: string, state?: web3.Finality) {
    try {
      let txData = await this._connection.getTransaction(hash, {
        commitment: state ? state : "confirmed",
      });
      if (
        txData !== (null || undefined) &&
        txData.meta !== (null || undefined)
      ) {
        let amount = txData.meta.postBalances[1] - txData.meta.preBalances[1];
        return {
          timeStamp: new Date(Number(txData.blockTime) * 1000),
          gasFee: txData.meta.fee / Math.pow(10, 9),
          amount: amount / Math.pow(10, 9),
          status: "",
          block: txData.slot,
          from: txData.transaction.message.accountKeys[0].toString(),
          to: txData.transaction.message.accountKeys[1].toString(),
          recentBlockHash: txData.transaction.message.recentBlockhash,
          instructionData: txData.transaction.message.instructions[0].data,
        };
      } else {
        console.log("Data is empty or unable to retrieve data");
      }
    } catch (error) {
      if (error instanceof Error) {
        // ✅ TypeScript knows err is Error
        throw new Error(error.message);
      } else {
        console.log("Unexpected error", error);
      }
    }
  }

  async getTransactionsHistory(params: SolTxHistoryParams) {
    try {
      const pubKey = new web3.PublicKey(params.address);
      let signatures = await this._connection.getConfirmedSignaturesForAddress2(
        pubKey,
        {
          limit: params.offset ? params.offset : 10,
          before: params.beforeHash ? params.beforeHash : null,
          until: params.untilHash ? params.untilHash : null,
        }
      );
      return signatures;
    } catch (error) {
      if (error instanceof Error) {
        // ✅ TypeScript knows err is Error
        throw new Error(error.message);
      } else {
        console.log("Unexpected error", error);
      }
    }
  }
}
