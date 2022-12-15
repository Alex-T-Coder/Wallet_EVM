import Arweave from "arweave";
import { NetworkType } from "@dojima-wallet/types";
import { ApiConfig } from "arweave/node/lib/api";

export default class ArweaveInitialise {
  _network: NetworkType;
  public _arweave: Arweave;

  constructor(network: NetworkType, config?: ApiConfig) {
    this._network = network;
    if (this._network === "testnet" || this._network === "devnet") {
      // Testnet
      this._arweave = Arweave.init(config);
    } else {
      // Mainnet
      this._arweave = Arweave.init({
        host: "arweave.net",
        protocol: "https",
        timeout: 100000,
      });
    }
  }
}
