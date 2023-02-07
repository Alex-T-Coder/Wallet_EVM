import { UsdtTokenGasFeeResult } from "./types";
import { EthereumInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { getUsdtTokenPriceResult } from "./utils";
import { SwapAssetList } from "@dojima-wallet/utils";
// import { assetAmount, assetToBase } from "@dojima-wallet/utils";

export default class EthereumChain extends EthereumInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(
    amount: number,
    memo?: string
  ): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.ethConnect.getFees(
      amount,
      memo ? memo : undefined
    );
    const result = await getUsdtTokenPriceResult(gasFee, "ethereum");
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

  async getDefaultLiquidityPoolGasFee(): Promise<UsdtTokenGasFeeResult> {
    const LPDefaultGasFee =
      await this.ethConnect.getDefaultLiquidityPoolGasFee();
    const eth_LPgasfee = {
      slow: LPDefaultGasFee,
      average: LPDefaultGasFee,
      fast: LPDefaultGasFee,
    };
    const result = await getUsdtTokenPriceResult(eth_LPgasfee, "ethereum");
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
