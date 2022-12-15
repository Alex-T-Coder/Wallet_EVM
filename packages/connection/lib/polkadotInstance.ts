import { NetworkType } from "@dojima-wallet/types";
import { PolkadotClient } from "./polkadot";
import { Network } from "@d11k-ts/client";

export default class PolkaClient {
  _network: Network;
  public _client: PolkadotClient;
  constructor(seed: string, network: NetworkType, provider?: string) {
    if (network === "testnet") this._network = Network.Testnet;
    else if (network === "devnet") this._network = Network.Stagenet;
    else this._network = Network.Mainnet;
    this._client = new PolkadotClient({
      phrase: seed,
      network: this._network,
      provider: provider,
    });
  }
}
