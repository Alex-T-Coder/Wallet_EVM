import { ArweaveClient } from "./arweave";
import { Network } from "@dojima-wallet/types";

export default class ArweaveInit {
  arConnect: ArweaveClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.Testnet) {
      this.arConnect = new ArweaveClient({
        phrase: mnemonic,
        network: network,
        config: {
          host: "ar-test.h4s.dojima.network",
          protocol: "https",
          timeout: 100000,
        },
        // config: {
        //   host: "localhost",
        //   port: "1984",
        //   protocol: "http",
        //   timeout: 100000,
        // },
      });
      // } else if (network === Network.Stagenet) {
      //   this.arConnect = new ArweaveClient({
      //     phrase: mnemonic,
      //     network: network,
      //     config: {
      //       host: "ar.h4s.dojima.network",
      //       protocol: "https",
      //       timeout: 100000,
      //     },
      //   });
    } else {
      this.arConnect = new ArweaveClient({
        phrase: mnemonic,
      });
    }
  }
}
