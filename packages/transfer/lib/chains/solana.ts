import { SolanaAccount } from "@dojima-wallet/account";
import { CoinGecko } from "@dojima-wallet/prices";
import { NetworkType } from "@dojima-wallet/types";
import {
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { GasfeeResult } from "./utils";

export default class SolanaChain extends SolanaAccount {
  _mnemonic: string;
  constructor(mnemonic: string, network: NetworkType) {
    super(network);
    this._mnemonic = mnemonic;
  }

  // Get recent block hash for calculating gas fee
  async getRecentBlockHash() {
    const blockHash = await this._connection.getRecentBlockhash();
    return blockHash;
  }

  // Calculate Gas fee based in recent block hash
  async getFees(): Promise<GasfeeResult> {
    const { feeCalculator } = await this.getRecentBlockHash();
    // return {
    //   slow: {
    //     fee: feeCalculator.lamportsPerSignature / Math.pow(10, 9),
    //   },
    //   average: {
    //     fee: feeCalculator.lamportsPerSignature / Math.pow(10, 9),
    //   },
    //   fast: {
    //     fee: feeCalculator.lamportsPerSignature / Math.pow(10, 9),
    //   },
    // };
    const sol_gasFee = feeCalculator.lamportsPerSignature / Math.pow(10, 9);
    const pricesInst = new CoinGecko();
    const pricesData = await pricesInst.getAssestsCurrentMarketData({
      assets: "solana",
    });
    if (pricesData !== undefined) {
      const usdt_gasFee = sol_gasFee * pricesData.current_price;
      const resultFee = {
        fee: {
          asset_fee: sol_gasFee,
          usdt_fee: usdt_gasFee,
        },
      };
      return {
        slow: resultFee,
        average: resultFee,
        fast: resultFee,
      };
    } else {
      throw new Error("Unable to retrieve current asset-usdt price");
    }
  }

  // Create transaction details based on user input
  async createTransaction(
    toAddress: string,
    amount: number
  ): Promise<Transaction> {
    // Get account address
    const pubKey = new PublicKey(await this.getAddress(this._mnemonic));

    // Convert toAddress string to PublicKey
    const to = new PublicKey(toAddress);

    const toAmount = Math.floor(amount * Math.pow(10, 9));
    // console.log('To Amount : ' , toAmount);

    // Add transaction for the required amount
    let rawTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: pubKey,
        toPubkey: to,
        lamports: toAmount,
      })
    );

    return rawTx;
  }

  async signAndSend(rawTx: Transaction): Promise<string> {
    // Get account details
    const account = await this.getKeypair(this._mnemonic);

    // Sign the transaction
    let signature = await sendAndConfirmTransaction(this._connection, rawTx, [
      account[0],
    ]);

    return signature;
  }
}
