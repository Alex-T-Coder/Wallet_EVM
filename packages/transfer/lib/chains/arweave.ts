import { Network } from "@dojima-wallet/types";
import { ArweaveInit } from "@dojima-wallet/connection";
import { getUsdtTokenPriceResult } from "./utils";
import { PoolData, UsdtTokenGasFeeResult } from "./types";
import { SwapAssetList } from "@dojima-wallet/utils";

export default class ArweaveChain extends ArweaveInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(
    recipient: string,
    amount: number
  ): Promise<UsdtTokenGasFeeResult> {
    // Gas fee generated by default during 'createTransaction'
    const rawTx = await this.arConnect.createTransaction(recipient, amount);
    const arw_gasFee = await this.arConnect.getFees(rawTx);
    const result = await getUsdtTokenPriceResult(arw_gasFee, "arweave");
    return result;
  }

  async transfer(recipient: string, amount: number): Promise<string> {
    const hash = await this.arConnect.transfer({ recipient, amount });
    return hash;
  }

  getSwapOutput(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.arConnect.getSwapOutput(amount, pool, toDoj);
  }

  getDoubleSwapOutput(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.arConnect.getDoubleSwapOutput(amount, pool1, pool2);
  }

  getSwapSlippage(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.arConnect.getSwapSlip(amount, pool, toDoj) * 100;
  }

  getDoubleSwapSlippage(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.arConnect.getDoubleSwapSlip(amount, pool1, pool2) * 100;
  }

  async getDefaultLiquidityPoolGasFee(): Promise<UsdtTokenGasFeeResult> {
    const LPDefaultGasFee =
      await this.arConnect.getDefaultLiquidityPoolGasFee();
    const arw_LPgasfee = {
      slow: LPDefaultGasFee,
      average: LPDefaultGasFee,
      fast: LPDefaultGasFee,
    };
    const result = await getUsdtTokenPriceResult(arw_LPgasfee, "ar");
    return result;
  }

  async addLiquidityPool(
    amount: number,
    dojimaAddress?: string
  ): Promise<string> {
    try {
      const inboundAddress = await this.arConnect.getArweaveInboundAddress();
      const liquidityPoolHash = await this.arConnect.addLiquidityPool(
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
      const inboundAddress = await this.arConnect.getArweaveInboundAddress();
      const swapHash = await this.arConnect.swap(
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
