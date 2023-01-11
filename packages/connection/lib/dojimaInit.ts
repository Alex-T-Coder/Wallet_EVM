import { Network } from "@dojima-wallet/types";
import { DojimaClient } from "./dojima";

export default class DojimaInit {
  dojConnect: DojimaClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.Testnet || network === Network.Stagenet) {
      this.dojConnect = new DojimaClient({
        phrase: mnemonic,
        network: Network.Testnet,
        rpcUrl: "https://api-test.d11k.dojima.network:8545/",
      });
    } else {
      this.dojConnect = new DojimaClient({
        phrase: mnemonic,
      });
    }
  }
}
