import { BncClient } from "@binance-chain/javascript-sdk";
import { NetworkType } from "@dojima-wallet/types";

export default class BinanceClient {
  _client: BncClient;
  _clientUrl: string;
  _network: NetworkType;

  constructor(network: NetworkType) {
    this._network = network;
    if (network === "mainnet") {
      this._clientUrl = "https://dex.binance.org";
      this._client = new BncClient(this._clientUrl);
    } else {
      this._clientUrl = "https://testnet-dex.binance.org";
      this._client = new BncClient(this._clientUrl);
    }
  }
}
