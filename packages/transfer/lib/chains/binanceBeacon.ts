import { Network } from "@dojima-wallet/types";
import { BinanceBeaconInit, BNB_DECIMAL } from "@dojima-wallet/connection";
import { getUsdtTokenPriceResult } from "./utils";
import { UsdtTokenGasFeeResult } from "./types";
import { assetAmount, assetToBase } from "@dojima-wallet/utils";

export default class BinanceBeaconChain extends BinanceBeaconInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.bnbBConnect.getFees();
    const btc_gasFee = {
      slow: gasFee.average.amount().toNumber(),
      average: gasFee.fast.amount().toNumber(),
      fast: gasFee.fastest.amount().toNumber(),
    };
    const result = await getUsdtTokenPriceResult(btc_gasFee, "bitcoin");
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
