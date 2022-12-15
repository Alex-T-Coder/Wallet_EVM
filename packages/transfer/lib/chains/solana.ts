import { SolanaAccount } from "@dojima-wallet/account";
import { CoinGecko } from "@dojima-wallet/prices";
import { NetworkType } from "@dojima-wallet/types";
import * as web3 from "@solana/web3.js";
import { GasfeeResult } from "./utils";

export default class SolanaChain extends SolanaAccount {
  _mnemonic: string;
  constructor(mnemonic: string, network: NetworkType, endpoint?: string) {
    super(network, endpoint);
    this._mnemonic = mnemonic;
  }

  // Calculate Gas fee based in recent block hash
  async getFees(): Promise<GasfeeResult> {
    const { feeCalculator } = await this._connection.getRecentBlockhash();
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
  ): Promise<web3.Transaction> {
    // Get account address
    const pubKey = new web3.PublicKey(await this.getAddress(this._mnemonic));

    // Convert toAddress string to PublicKey
    const to = new web3.PublicKey(toAddress);

    const toAmount = Math.floor(amount * Math.pow(10, 9));

    // Add transaction for the required amount
    let rawTx = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: pubKey,
        toPubkey: to,
        lamports: toAmount,
      })
    );

    return rawTx;
  }

  async signAndSend(rawTx: web3.Transaction): Promise<string> {
    // Get account details
    const account = await this.getKeypair(this._mnemonic);

    // Sign the transaction
    let signature = await web3.sendAndConfirmTransaction(
      this._connection,
      rawTx,
      [account[0]]
    );

    return signature;
  }
}
