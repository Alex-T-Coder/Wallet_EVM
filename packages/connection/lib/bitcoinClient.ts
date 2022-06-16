import { NetworkType } from "@dojima-wallet/types";
import BitcoinClient from "./bitcoin";

export default class BtcClient {
  _network: string;
  public _client: BitcoinClient;
  constructor(network: NetworkType) {
    this._client = new BitcoinClient(network);
    this._network = network;
  }
}
