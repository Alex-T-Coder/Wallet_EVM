import { NetworkType } from "@dojima-wallet/types";
import axios from "axios";
import { FeeOption, FeeRates } from "./types/fees";

export default class BTCFeesClient {
  _network: NetworkType;
  constructor(network: NetworkType) {
    this._network = network;
  }

  async getFeeRates(): Promise<FeeRates> {
    const feeRate = await this.getFees();
    console.log("Thorchain Fee Rate :: ", feeRate);
    return this.standardFeeRates(feeRate);
  }

  async getFees(): Promise<number> {
    try {
      return await this.getFeeRateFromThorchain();
    } catch (error) {
      console.warn(`Rate lookup via Thorchain failed: ${error}`);
    }
    return await this.getSuggestedFeeRate();
  }

  async getFeeRateFromThorchain(): Promise<number> {
    const respData = await this.thornodeAPIGet("/inbound_addresses");
    if (!Array.isArray(respData))
      throw new Error("bad response from Thornode API");

    const chainData: { chain: string; gas_rate: string } = respData.find(
      (elem) => elem.chain === "BTC" && typeof elem.gas_rate === "string"
    );
    if (!chainData)
      throw new Error(
        `Thornode API /inbound_addresses does not contain fees for BTC`
      );

    return Number(chainData.gas_rate);
  }

  async thornodeAPIGet(endpoint: string): Promise<unknown> {
    const url = (() => {
      switch (this._network) {
        case "mainnet":
          return "https://thornode.ninerealms.com/thorchain";
        case "devnet":
          return "https://stagenet-thornode.ninerealms.com/thorchain";
        case "testnet":
          return "https://testnet.thornode.thorchain.info/thorchain";
      }
    })();
    return (await axios.get(url + endpoint)).data;
  }

  async getSuggestedFeeRate(): Promise<number> {
    //Note: sochain does not provide fee rate related data
    //So use Bitgo API for fee estimation
    //Refer: https://app.bitgo.com/docs/#operation/v2.tx.getfeeestimate
    try {
      const response = await axios.get(
        "https://app.bitgo.com/api/v2/btc/tx/fee"
      );
      return response.data.feePerKb / 1000; // feePerKb to feePerByte
    } catch (error) {
      return 127;
    }
  }

  singleFeeRate(rate: number): FeeRates {
    return Object.values(FeeOption).reduce<Partial<FeeRates>>(
      (a, x) => ((a[x] = rate), a),
      {}
    ) as FeeRates;
  }

  standardFeeRates(rate: number): FeeRates {
    return {
      ...this.singleFeeRate(rate),
      [FeeOption.Average]: rate * 0.5,
      [FeeOption.Fastest]: rate * 5.0,
    };
  }
}