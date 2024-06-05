import { Network } from "@dojima-wallet/types";
import { HermesClient } from "./hermes";

export default class HermesInit {
  h4sConnect: HermesClient;
  constructor(
    mnemonic: string,
    network: Network,
    apiUrl: string,
    rpcUrl: string
  ) {
    this.h4sConnect = new HermesClient({
      phrase: mnemonic,
      network: network,
      apiUrl: apiUrl,
      rpcUrl: rpcUrl,
    });
  }
}
