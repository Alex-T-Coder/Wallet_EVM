import { BtcClient } from "@dojima-wallet/connection";
import { NetworkType } from "@dojima-wallet/types";

interface BtcRawTransactionResult {
  tx_hex: string;
  gas_fee: number;
}

export default class BitcoinChain extends BtcClient {
  constructor(network: NetworkType) {
    super(network);
  }

  async getGasFee(
    amount: number,
    mnemonic: string,
    feeRate: number,
    to?: string,
    memo?: string
  ): Promise<number> {
    const from: string = this._client.getAddress(mnemonic);
    try {
      const rawTxDetails: BtcRawTransactionResult =
        await this._client.createTransaction(
          amount,
          from,
          to ? to : "tb1q8w9emc5tdxwc7d3phupc8ltp0djmsnc2ngxnpp",
          mnemonic,
          feeRate,
          memo ? memo : undefined
        );
      return rawTxDetails.gas_fee;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "No utxos to send") {
          const from: string = this._client.getAddress(
            process.env.SAMPLE_SEED_PHRASE as string
          );
          const rawTxDetails: BtcRawTransactionResult =
            await this._client.createTransaction(
              amount,
              from,
              to ? to : "tb1q8w9emc5tdxwc7d3phupc8ltp0djmsnc2ngxnpp",
              process.env.SAMPLE_SEED_PHRASE as string,
              feeRate,
              memo ? memo : undefined
            );
          return rawTxDetails.gas_fee;
        } else {
          // ✅ TypeScript knows err is Error
          throw new Error(error.message);
        }
      } else {
        throw new Error("Unexpected error");
      }
    }
  }

  async rawTransaction(
    amount: number,
    mnemonic: string,
    to: string,
    feeRate: number,
    memo?: string
  ): Promise<BtcRawTransactionResult> {
    const from: string = this._client.getAddress(mnemonic);
    const rawTxDetails: BtcRawTransactionResult =
      await this._client.createTransaction(
        amount,
        from,
        to,
        mnemonic,
        feeRate,
        memo ? memo : undefined
      );
    return rawTxDetails;
  }

  async transfer(txHex: string): Promise<string> {
    const txHash = await this._client.transfer(txHex);
    return txHash;
  }
}
