import { Network } from "@dojima-wallet/types";
import { UsdtTokenGasFeeResult } from "./types";
import { SolanaInit } from "@dojima-wallet/connection";
import { getUsdtTokenPriceResult } from "./utils";
import { SwapAssetList } from "@dojima-wallet/utils";

export default class SolanaChain extends SolanaInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.solConnect.getFees();
    const sol_gasFee = {
      slow: gasFee.slow,
      average: gasFee.average,
      fast: gasFee.fast,
    };
    const result = await getUsdtTokenPriceResult(sol_gasFee, "solana");
    return result;
  }

  async transfer(recipient: string, amount: number): Promise<string> {
    const hash = await this.solConnect.transfer({
      recipient,
      amount,
    });
    return hash;
  }

  async getDefaultLiquidityPoolGasFee(): Promise<UsdtTokenGasFeeResult> {
    const LPDefaultGasFee =
      await this.solConnect.getDefaultLiquidityPoolGasFee();
    const sol_LPgasfee = {
      slow: LPDefaultGasFee,
      average: LPDefaultGasFee,
      fast: LPDefaultGasFee,
    };
    const result = await getUsdtTokenPriceResult(sol_LPgasfee, "solana");
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
