import { NetworkType } from "@dojima-wallet/types";
import * as web3 from "@solana/web3.js";

export default class SolanaConnection {
  _network: NetworkType;
  // _cluster: web3.Cluster;
  _endpoint: string;
  public _connection: web3.Connection;
  constructor(network: NetworkType, endpoint?: string) {
    this._network = network;
    // if (this._network === "devnet") {
    //   this._cluster = "devnet";
    // } else if (this._network === "testnet") {
    //   this._cluster = "testnet";
    // } else {
    //   this._cluster = "mainnet-beta";
    // }
    // this._connection = new web3.Connection(
    //   web3.clusterApiUrl(this._cluster),
    //   "confirmed"
    // );
    if (this._network === "devnet" || this._network === "testnet") {
      this._endpoint = endpoint;
    } else {
      this._endpoint = web3.clusterApiUrl("mainnet-beta");
    }
    this._connection = new web3.Connection(this._endpoint, "confirmed");
  }
}
