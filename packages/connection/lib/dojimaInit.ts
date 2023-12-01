import { Network } from "@dojima-wallet/types";
import { DojimaClient } from "./dojima";

export default class DojimaInit {
  dojConnect: DojimaClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.Mainnet) {
      this.dojConnect = new DojimaClient({
        phrase: mnemonic,
      });
    } else {
      this.dojConnect = new DojimaClient({
        phrase: mnemonic,
        network: network,
        rpcUrl: "https://api-test.d11k.dojima.network/",
      });
    }
  }
}
