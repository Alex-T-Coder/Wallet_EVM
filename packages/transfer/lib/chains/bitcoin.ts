import { Network } from "@dojima-wallet/types";
import { BitcoinInit, BTC_DECIMAL } from "@dojima-wallet/connection";
import { getUsdtTokenPriceResult } from "./utils";
import { UsdtTokenGasFeeResult } from "./types";
import { assetAmount, AssetBTC, assetToBase } from "@dojima-wallet/utils";

export default class BitcoinChain extends BitcoinInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.btcConnect.getFees();
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
    feeRate?: number
  ): Promise<string> {
    const baseAmt = assetToBase(assetAmount(amount, BTC_DECIMAL));
    const hash = await this.btcConnect.transfer({
      recipient,
      amount: baseAmt,
      asset: AssetBTC,
      feeRate,
    });
    return hash;
  }
}
