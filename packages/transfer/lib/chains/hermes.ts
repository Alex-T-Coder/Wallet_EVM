import { PoolData, UsdtTokenGasFeeResult } from "./types";
import { DOJ_DECIMAL, HermesInit } from "@dojima-wallet/connection";
import { Network } from "@dojima-wallet/types";
import { getUsdtTokenPriceResult } from "./utils";
import {
  assetAmount,
  assetToBase,
  baseAmount,
  baseToAsset,
  SwapAssetList,
} from "@dojima-wallet/utils";
import BigNumber from "bignumber.js";

export default class HermesChain extends HermesInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.h4sConnect.getFees();
    const h4s_gasFee = {
      slow: Number(baseToAsset(baseAmount(gasFee.average.amount())).amount()),
      average: Number(baseToAsset(baseAmount(gasFee.fast.amount())).amount()),
      fast: Number(baseToAsset(baseAmount(gasFee.fastest.amount())).amount()),
    };
    const result = await getUsdtTokenPriceResult(h4s_gasFee, "h4s");
    return result;
  }

  async transfer(
    recipient: string,
    amount: number,
    gasPrice?: number,
    memo?: string
  ): Promise<string> {
    const baseAmt = assetToBase(assetAmount(amount, DOJ_DECIMAL));
    const hash = await this.h4sConnect.transfer({
      recipient,
      amount: baseAmt,
      gasLimit: gasPrice
        ? new BigNumber(gasPrice * Math.pow(10, DOJ_DECIMAL))
        : undefined,
      memo: memo ? memo : undefined,
    });
    return hash;
  }

  getSwapOutput(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.h4sConnect.getSwapOutput(amount, pool, toDoj);
  }

  getDoubleSwapOutput(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.h4sConnect.getDoubleSwapOutput(amount, pool1, pool2);
  }

  getSwapSlippage(amount: number, pool: PoolData, toDoj: boolean): number {
    return this.h4sConnect.getSwapSlip(amount, pool, toDoj) * 100;
  }

  getDoubleSwapSlippage(
    amount: number,
    pool1: PoolData,
    pool2: PoolData
  ): number {
    return this.h4sConnect.getDoubleSwapSlip(amount, pool1, pool2) * 100;
  }

  async addLiquidityPool(
    amount: number,
    recipient: string,
    token: SwapAssetList
  ): Promise<string> {
    try {
      const baseAmt = assetToBase(assetAmount(amount, DOJ_DECIMAL));
      const memo = `ADD:${token}:${recipient}`;
      const liquidityPoolHash = await this.h4sConnect.deposit({
        amount: baseAmt,
        memo,
      });
      return liquidityPoolHash;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async swap(amount: number, recipient: string, token: SwapAssetList) {
    try {
      const baseAmt = assetToBase(assetAmount(amount, DOJ_DECIMAL));
      const memo = `SWAP:${token}:${recipient}`;
      const swapHash = await this.h4sConnect.deposit({
        amount: baseAmt,
        memo,
      });
      return swapHash;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async bondAddress(amount: number, recipient: string): Promise<string> {
    try {
      const baseAmt = assetToBase(assetAmount(amount, DOJ_DECIMAL));
      const memo = `BOND:${recipient}`;
      const bondAddresslHash = await this.h4sConnect.deposit({
        amount: baseAmt,
        memo,
      });
      return bondAddresslHash;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async setVersion(version: string) {
    try {
      const setVersionHash = await this.h4sConnect.setVersion({ version });
      return setVersionHash;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async setIpAddress(ipAddress: string) {
    try {
      const setIpAddressHash = await this.h4sConnect.setIpAddress({
        ipAddress,
      });
      return setIpAddressHash;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async setPubkeys(
    secp256k1Pubkey: string,
    ed25519Pubkey: string,
    validatorConsPubkey: string
  ) {
    try {
      const setPubKeysHash = await this.h4sConnect.setPubkeys({
        secp256k1Pubkey,
        ed25519Pubkey,
        validatorConsPubkey,
      });
      return setPubKeysHash;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
