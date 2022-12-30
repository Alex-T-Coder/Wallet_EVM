import { Network } from "@dojima-wallet/types";
import { UsdtTokenGasFeeResult } from "./types";
import { SwapAssetList } from "@dojima-wallet/utils";
import { PolkadotInit } from "@dojima-wallet/connection";
import { getUsdtTokenPriceResult } from "./utils";

export default class PolkadotChain extends PolkadotInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(
    recipient: string,
    amount: number
  ): Promise<UsdtTokenGasFeeResult> {
    const dot_gasFee = await this.dotConnect.getFees({
      recipient,
      amount,
    });
    const result = await getUsdtTokenPriceResult(dot_gasFee, "polkadot");
    return result;
  }

  async transfer(recipient: string, amount: number): Promise<string> {
    const hash = await this.dotConnect.transfer({ recipient, amount });
    return hash;
  }

  async getDefaultLiquidityPoolGasFee(): Promise<UsdtTokenGasFeeResult> {
    const LPDefaultGasFee =
      await this.dotConnect.getDefaultLiquidityPoolGasFee();
    const dot_LPgasfee = {
      slow: LPDefaultGasFee,
      average: LPDefaultGasFee,
      fast: LPDefaultGasFee,
    };
    const result = await getUsdtTokenPriceResult(dot_LPgasfee, "polkadot");
    return result;
  }

  async addLiquidityPool(
    amount: number,
    dojimaAddress?: string
  ): Promise<string> {
    try {
      const inboundAddress = await this.dotConnect.getPolkadotInboundAddress();
      const liquidityPoolHash = await this.dotConnect.addLiquidityPool(
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
      const inboundAddress = await this.dotConnect.getPolkadotInboundAddress();
      const swapHash = await this.dotConnect.swap(
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

  async polkaBatchTxsToHermes(
    amount: number,
    inboundAddress: string,
    memo: string
  ): Promise<string> {
    const batchTxHash = await this.dotConnect.polkaBatchTxsToHermes(
      amount,
      inboundAddress,
      memo
    );

    return batchTxHash;
  }
}
