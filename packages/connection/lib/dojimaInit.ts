import { Network } from "@dojima-wallet/types";
import { DojimaClient } from "./dojima";

export default class DojimaInit {
  dojConnect: DojimaClient;
  constructor(mnemonic: string, network: Network, rpcUrl: string) {
    this.dojConnect = new DojimaClient({
      phrase: mnemonic,
      network: network,
      rpcUrl: rpcUrl,
    });
  }
}
