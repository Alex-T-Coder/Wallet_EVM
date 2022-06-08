import * as ethers from "ethers";
import { NetworkType } from "@dojima-wallet/types/dist/lib/network";
import { BigNumber } from "bignumber.js";
import { TransactionConfig } from "web3-core";
import { EthereumAccount } from "@dojima-wallet/account";

export default class EthereumChain extends EthereumAccount {
  _mnemonic: string;
  constructor(mnemonic: string, network: NetworkType) {
    super(network);
    this._mnemonic = mnemonic;
  }

  // Calculate 'gasFee' based on multiplier
  calculateFee(baseGasFee: number, multiplier: number): number {
    const fee = new BigNumber(baseGasFee)
      .times(new BigNumber(multiplier))
      .toNumber();
    return fee;
  }

  // Calculate gasFee required for transaction
  async getGasFee() {
    const baseGasFee = await this._web3.eth.getGasPrice();
    return {
      slow: {
        fee: this.calculateFee(parseFloat(baseGasFee), 1) / Math.pow(10, 18),
      },
      average: {
        fee: this.calculateFee(parseFloat(baseGasFee), 1.5) / Math.pow(10, 18),
      },
      fast: {
        fee: this.calculateFee(parseFloat(baseGasFee), 2) / Math.pow(10, 18),
      },
    };
  }

  // Create transaction details based on user input
  createTransaction(toAddress: string, amount: number, feeRate: number) {
    let rawTxDetails = {
      from: this.getAddress(this._mnemonic),
      to: toAddress,
      value: this._web3.utils.toWei(amount.toFixed(9), "ether"), // Amount in Eth, 1 eth = 10^9 gwei(1,000,000,000)
      gas: 21000, // Minimum / base gas fee is 21,000
      gasPrice: Math.round(feeRate * Math.pow(10, 18)),
    };
    return rawTxDetails;
  }

  async signAndSend(rawTxDetails: TransactionConfig) {
    const wallet = ethers.Wallet.fromMnemonic(this._mnemonic);
    const pvtKey = wallet.privateKey;
    const transaction = await this._web3.eth.accounts.signTransaction(
      rawTxDetails,
      pvtKey
    );

    const transactionResult = await this._web3.eth.sendSignedTransaction(
      transaction.rawTransaction as string
    );
    return transactionResult.transactionHash;
  }
}
