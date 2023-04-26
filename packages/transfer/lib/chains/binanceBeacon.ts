import { Network } from "@dojima-wallet/types";
import { BinanceBeaconInit, BNB_DECIMAL } from "@dojima-wallet/connection";
import { convertAssetBNtoBaseNumber, getUsdtTokenPriceResult } from "./utils";
import { PoolData, UsdtTokenGasFeeResult } from "./types";
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
    const result = await getUsdtTokenPriceResult(bnb_gasFee, "bnb");
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

  getSwapOutput(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.bnbBConnect.getSwapOutput(amount, pool, toDoj);
  }

  getDoubleSwapOutput(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.bnbBConnect.getDoubleSwapOutput(amount, pool1, pool2);
  }

  getSwapSlippage(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.bnbBConnect.getSwapSlip(amount, pool, toDoj) * 100;
  }

  getDoubleSwapSlippage(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.bnbBConnect.getDoubleSwapSlip(amount, pool1, pool2) * 100;
  }

  async getDefaultLiquidityPoolGasFee(): Promise<UsdtTokenGasFeeResult> {
    const LPDefaultGasFee =
      await this.bnbBConnect.getDefaultLiquidityPoolGasFee();
    const bnb_LPgasfee = {
      slow: LPDefaultGasFee,
      average: LPDefaultGasFee,
      fast: LPDefaultGasFee,
    };
    const result = await getUsdtTokenPriceResult(bnb_LPgasfee, "bnb");
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
