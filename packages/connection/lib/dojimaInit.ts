import { Network } from "@dojima-wallet/types";
import { DojimaClient } from "./dojima";

export default class DojimaInit {
  dojConnect: DojimaClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.Testnet) {
      this.dojConnect = new DojimaClient({
        phrase: mnemonic,
        network: network,
        rpcUrl: "https://api-dev.d11k.dojima.network/",
      });
    } else {
      this.dojConnect = new DojimaClient({
        phrase: mnemonic,
      });
    }
  }
}
