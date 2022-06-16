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
