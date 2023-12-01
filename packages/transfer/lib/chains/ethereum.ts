import { PoolData, UsdtTokenGasFeeResult } from "./types";
import { EthereumInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { getUsdtTokenPriceResult } from "./utils";
import { SwapAssetList } from "@dojima-wallet/utils";
// import { assetAmount, assetToBase } from "@dojima-wallet/utils";

export default class EthereumChain extends EthereumInit {
  constructor(mnemonic: string, network: Network, apiKey?: string) {
    super(mnemonic, network, apiKey);
  }

  async getGasFee(
    amount: number,
    memo?: string
  ): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.ethConnect.getFees(
      amount,
      memo ? memo : undefined
    );
    const result = await getUsdtTokenPriceResult(gasFee, "eth");
    return result;
  }

  async transfer(
    recipient: string,
    amount: number,
    gasPrice?: number,
    memo?: string
  ): Promise<string> {
    const hash = await this.ethConnect.transfer({
      recipient,
      amount,
      fee: gasPrice ? gasPrice : undefined,
      memo: memo ? memo : undefined,
    });
    return hash;
  }

  getSwapOutput(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.ethConnect.getSwapOutput(amount, pool, toDoj);
  }

  getDoubleSwapOutput(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.ethConnect.getDoubleSwapOutput(amount, pool1, pool2);
  }

  getSwapSlippage(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.ethConnect.getSwapSlip(amount, pool, toDoj) * 100;
  }

  getDoubleSwapSlippage(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.ethConnect.getDoubleSwapSlip(amount, pool1, pool2) * 100;
  }

  async getDefaultLiquidityPoolGasFee(): Promise<UsdtTokenGasFeeResult> {
    const LPDefaultGasFee =
      await this.ethConnect.getDefaultLiquidityPoolGasFee();
    const eth_LPgasfee = {
      slow: LPDefaultGasFee,
      average: LPDefaultGasFee,
      fast: LPDefaultGasFee,
    };
    const result = await getUsdtTokenPriceResult(eth_LPgasfee, "eth");
    return result;
  }

  async addLiquidityPool(
    amount: number,
    dojimaAddress?: string
  ): Promise<string> {
    try {
      const inboundAddress = await this.ethConnect.getEthereumInboundAddress();
      const liquidityPoolHash = await this.ethConnect.addLiquidityPool(
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
      const inboundAddress = await this.ethConnect.getEthereumInboundAddress();
      const swapHash = await this.ethConnect.swap(
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

  // async getGasFee(
  //   recipient: string,
  //   amount: number
  // ): Promise<UsdtTokenGasFeeResult> {
  //   const baseAmt = assetToBase(assetAmount(amount, ETH_DECIMAL));
  //   const gasFee = await this.ethConnect.getFees({
  //     amount: baseAmt,
  //     recipient,
  //   });
  //   const eth_gasFee = {
  //     slow: convertAssetBNtoBaseNumber(gasFee.average.amount(), ETH_DECIMAL),
  //     average: convertAssetBNtoBaseNumber(gasFee.fast.amount(), ETH_DECIMAL),
  //     fast: convertAssetBNtoBaseNumber(gasFee.fastest.amount(), ETH_DECIMAL),
  //   };
  //   const result = await getUsdtTokenPriceResult(eth_gasFee, "ethereum");
  //   return result;
  // }
  //
  // async transfer(
  //   recipient: string,
  //   amount: number,
  //   gasPrice?: number,
  //   memo?: string
  // ): Promise<string> {
  //   const baseAmt = assetToBase(assetAmount(amount, ETH_DECIMAL));
  //   const hash = await this.ethConnect.transfer({
  //     recipient,
  //     amount: baseAmt,
  //     gasPrice: gasPrice
  //       ? assetToBase(assetAmount(gasPrice, ETH_DECIMAL))
  //       : undefined,
  //     memo,
  //   });
  //   return hash;
  // }
}
