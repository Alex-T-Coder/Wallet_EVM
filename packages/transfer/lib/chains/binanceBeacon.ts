import { Network } from "@dojima-wallet/types";
import { BinanceBeaconInit, BNB_DECIMAL } from "@dojima-wallet/connection";
import { convertAssetBNtoBaseNumber, getUsdtTokenPriceResult } from "./utils";
import { UsdtTokenGasFeeResult } from "./types";
import { assetAmount, assetToBase, SwapAssetList } from "@dojima-wallet/utils";

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
      memo: memo ? memo : undefined,
    });
    return hash;
  }

  async getDefaultLiquidityPoolGasFee(): Promise<UsdtTokenGasFeeResult> {
    const LPDefaultGasFee =
      await this.bnbBConnect.getDefaultLiquidityPoolGasFee();
    const bnb_LPgasfee = {
      slow: LPDefaultGasFee,
      average: LPDefaultGasFee,
      fast: LPDefaultGasFee,
    };
    const result = await getUsdtTokenPriceResult(bnb_LPgasfee, "binancecoin");
    return result;
  }

  async addLiquidityPool(
    amount: number,
    dojimaAddress?: string
  ): Promise<string> {
    try {
      const inboundAddress = await this.bnbBConnect.getBinanceInboundAddress();
      const liquidityPoolHash = await this.bnbBConnect.addLiquidityPool(
        amount,
        inboundAddress,
        dojimaAddress
      );
      return liquidityPoolHash;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async swap(amount: number, recipient: string, token: SwapAssetList) {
    try {
      const inboundAddress = await this.bnbBConnect.getBinanceInboundAddress();
      const swapHash = await this.bnbBConnect.swap(
        amount,
        token,
        inboundAddress,
        recipient
      );
      return swapHash;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
