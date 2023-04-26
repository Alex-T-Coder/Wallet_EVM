import { UsdtTokenGasFeeResult } from "./types";
import { DojimaInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { getUsdtTokenPriceResult } from "./utils";

export default class DojimaChain extends DojimaInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(
    amount: number,
    memo?: string
  ): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.dojConnect.getFees(
      amount,
      memo ? memo : undefined
    );
    const result = await getUsdtTokenPriceResult(gasFee, "doj");
    return result;
  }

  async transfer(
    recipient: string,
    amount: number,
    gasPrice?: number,
    memo?: string
  ): Promise<string> {
    const hash = await this.dojConnect.transfer({
      recipient,
      amount,
      fee: gasPrice ? gasPrice : undefined,
      memo: memo ? memo : undefined,
    });
    return hash;
  }
}
