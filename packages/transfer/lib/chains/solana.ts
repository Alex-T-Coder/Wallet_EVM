import { SolanaAccount } from "@dojima-wallet/account";
import { NetworkType } from "@dojima-wallet/types";
import {
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

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
  async getFees() {
    const { feeCalculator } = await this.getRecentBlockHash();
    return {
      slow: {
        fee: feeCalculator.lamportsPerSignature / Math.pow(10, 9),
      },
      average: {
        fee: feeCalculator.lamportsPerSignature / Math.pow(10, 9),
      },
      fast: {
        fee: feeCalculator.lamportsPerSignature / Math.pow(10, 9),
      },
    };
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
