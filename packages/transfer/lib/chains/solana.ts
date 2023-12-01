import { Network } from "@dojima-wallet/types";
import { PoolData, UsdtTokenGasFeeResult } from "./types";
import { SolanaInit } from "@dojima-wallet/connection";
import { getUsdtTokenPriceResult } from "./utils";
import { SwapAssetList } from "@dojima-wallet/utils";

export default class SolanaChain extends SolanaInit {
  constructor(mnemonic: string, network: Network, apiKey?: string) {
    super(mnemonic, network, apiKey);
  }

  async getGasFee(): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.solConnect.getFees();
    const sol_gasFee = {
      slow: gasFee.slow,
      average: gasFee.average,
      fast: gasFee.fast,
    };
    const result = await getUsdtTokenPriceResult(sol_gasFee, "sol");
    return result;
  }

  async transfer(recipient: string, amount: number): Promise<string> {
    const hash = await this.solConnect.transfer({
      recipient,
      amount,
    });
    return hash;
  }

  getSwapOutput(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.solConnect.getSwapOutput(amount, pool, toDoj);
  }

  getDoubleSwapOutput(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.solConnect.getDoubleSwapOutput(amount, pool1, pool2);
  }

  getSwapSlippage(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.solConnect.getSwapSlip(amount, pool, toDoj) * 100;
  }

  getDoubleSwapSlippage(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.solConnect.getDoubleSwapSlip(amount, pool1, pool2) * 100;
  }

  async getDefaultLiquidityPoolGasFee(): Promise<UsdtTokenGasFeeResult> {
    const LPDefaultGasFee =
      await this.solConnect.getDefaultLiquidityPoolGasFee();
    const sol_LPgasfee = {
      slow: LPDefaultGasFee,
      average: LPDefaultGasFee,
      fast: LPDefaultGasFee,
    };
    const result = await getUsdtTokenPriceResult(sol_LPgasfee, "sol");
    return result;
  }

  async addLiquidityPool(
    amount: number,
    dojimaAddress?: string
  ): Promise<string> {
    try {
      const inboundAddress = await this.solConnect.getSolanaInboundAddress();
      const liquidityPoolHash = await this.solConnect.addLiquidityPool(
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
      const inboundAddress = await this.solConnect.getSolanaInboundAddress();
      const swapHash = await this.solConnect.swap(
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
