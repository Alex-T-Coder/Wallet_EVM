import { PolkadotAccount } from "@dojima-wallet/account";
import { NetworkType } from "@dojima-wallet/types";
import { GasfeeResult } from "./utils";
import { CoinGecko } from "@dojima-wallet/prices";
import { InboundAddressResult, SwapAssetList } from "@dojima-wallet/utils";

export default class PolkadotChain extends PolkadotAccount {
  _mnemonic: string;

  constructor(mnemonic: string, network: NetworkType, provider?: string) {
    super(mnemonic, network, provider);
    this._mnemonic = mnemonic;
  }

  async transfer(recipient: string, amount: number): Promise<string> {
    const hash = await this._client.transfer({ recipient, amount });
    return hash;
  }

  async getFees(recipient: string, amount: number): Promise<GasfeeResult> {
    const rawTx = await this._client.buildTx({ recipient, amount });
    const paymentInfo = await rawTx.paymentInfo(await this.getAddress());
    const dot_gasFee = paymentInfo.partialFee.toNumber() / Math.pow(10, 10);
    const pricesInst = new CoinGecko();
    const pricesData = await pricesInst.getAssestsCurrentMarketData({
      assets: "polkadot",
    });
    if (pricesData !== undefined) {
      const usdt_gasFee = dot_gasFee * pricesData.current_price;
      const resultFee = {
        fee: {
          asset_fee: dot_gasFee,
          usdt_fee: usdt_gasFee,
        },
      };
      return {
        slow: resultFee,
        average: resultFee,
        fast: resultFee,
      };
    } else {
      throw new Error("Unable to retrieve current asset-usdt price");
    }
  }

  async getInboundObject(): Promise<InboundAddressResult> {
    const inboundObj = await this._client.getInboundObject();
    return inboundObj;
  }

  async getPolkadotInboundAddress(): Promise<string> {
    const inboundObj = await this.getInboundObject();
    return inboundObj.address;
  }

  async getDefaultLiquidityPoolGasFee(): Promise<number> {
    const gasFee = await this._client.getDefaultLiquidityPoolGasFee();

    return gasFee;
  }

  async polkaBatchTxsToHermes(
    amount: number,
    inboundAddress: string,
    memo: string
  ): Promise<string> {
    const batchTxHash = await this._client.polkaBatchTxsToHermes(
      amount,
      inboundAddress,
      memo
    );

    return batchTxHash;
  }

  async addLiquidityPool(
    amount: number,
    inboundAddress: string,
    dojAddress?: string
  ): Promise<string> {
    const txHash = await this._client.addLiquidityPool(
      amount,
      inboundAddress,
      dojAddress
    );

    return txHash;
  }

  async swap(
    amount: number,
    token: SwapAssetList,
    inboundAddress: string,
    recipient: string
  ): Promise<string> {
    const txHash = await this._client.swap(
      amount,
      token,
      inboundAddress,
      recipient
    );

    return txHash;
  }
}
