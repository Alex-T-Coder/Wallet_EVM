import { Network } from "@dojima-wallet/types";
import { BinanceBeaconInit, BNB_DECIMAL } from "@dojima-wallet/connection";
import { convertAssetBNtoBaseNumber, getUsdtTokenPriceResult } from "./utils";
import { UsdtTokenGasFeeResult } from "./types";
import { assetAmount, assetToBase } from "@dojima-wallet/utils";

export default class BinanceBeaconChain extends BinanceBeaconInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.bnbBConnect.getFees();
    const bnb_gasFee = {
      slow: convertAssetBNtoBaseNumber(gasFee.average.amount(), BNB_DECIMAL),
      average: convertAssetBNtoBaseNumber(gasFee.fast.amount(), BNB_DECIMAL),
      fast: convertAssetBNtoBaseNumber(gasFee.fastest.amount(), BNB_DECIMAL),
    };
    const result = await getUsdtTokenPriceResult(bnb_gasFee, "binancecoin");
    return result;
  }

  async transfer(
    recipient: string,
    amount: number,
    memo?: string
  ): Promise<string> {
    const baseAmt = assetToBase(assetAmount(amount, BNB_DECIMAL));
    const hash = await this.bnbBConnect.transfer({
      recipient,
      amount: baseAmt,
      memo,
    });
    return hash;
  }
}
