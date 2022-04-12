import { NetworkType } from "@dojima-wallet/types";

export default class BinanceClient {
  api: string;
  constructor(network: NetworkType) {
    if (network === "testnet") {
      this.api = "https://testnet.binance.vision";
    } else {
      this.api = "https://api.binance.com";
    }
  }
}
