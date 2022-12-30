import { UsdtTokenGasFeeResult } from "./types";
import { ETH_DECIMAL, EthereumInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { getUsdtTokenPriceResult } from "./utils";
import { assetAmount, assetToBase } from "@dojima-wallet/utils";

export default class EthereumChain extends EthereumInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(
    recipient: string,
    amount: number
  ): Promise<UsdtTokenGasFeeResult> {
    const baseAmt = assetToBase(assetAmount(amount, ETH_DECIMAL));
    const gasFee = await this.ethConnect.getFees({
      amount: baseAmt,
      recipient,
    });
    const btc_gasFee = {
      slow: gasFee.average.amount().toNumber(),
      average: gasFee.fast.amount().toNumber(),
      fast: gasFee.fastest.amount().toNumber(),
    };
    const result = await getUsdtTokenPriceResult(btc_gasFee, "ethereum");
    return result;
  }

  async transfer(
    recipient: string,
    amount: number,
    gasPrice?: number,
    memo?: string
  ): Promise<string> {
    const baseAmt = assetToBase(assetAmount(amount, ETH_DECIMAL));
    const hash = await this.ethConnect.transfer({
      recipient,
      amount: baseAmt,
      gasPrice: gasPrice
        ? assetToBase(assetAmount(gasPrice, ETH_DECIMAL))
        : undefined,
      memo,
    });
    return hash;
  }
}
