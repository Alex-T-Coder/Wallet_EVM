import { DojimaInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { DojTxDataType } from "./types";

export default class DojimaTxs extends DojimaInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getTransactionData(hash: string): Promise<DojTxDataType> {
    const data = await this.dojConnect.getTransactionData(hash);
    if (data) {
      return {
        transfer_type:
          data.from === this.dojConnect.getAddress()
            ? "Send | DOJ"
            : "Receive | DOJ",
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
      throw new Error(`Unable to retrieve data`);
    }
  }
}
