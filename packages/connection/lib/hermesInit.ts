import { Network } from "@dojima-wallet/types";
import { HermesClient } from "./hermes";

export default class HermesInit {
  h4sConnect: HermesClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.Mainnet) {
      this.h4sConnect = new HermesClient({
        phrase: mnemonic,
      });
    } else {
      this.h4sConnect = new HermesClient({
        phrase: mnemonic,
        network: network,
      });
    }
  }
}
