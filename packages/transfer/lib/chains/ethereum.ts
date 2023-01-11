import { UsdtTokenGasFeeResult } from "./types";
import { EthereumInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { getUsdtTokenPriceResult } from "./utils";
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
