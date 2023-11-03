import { BinanceBeaconClient } from "./binance-beacon";
import { Network } from "@dojima-wallet/types";

export default class BinanceBeaconInit {
  bnbBConnect: BinanceBeaconClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.Testnet || network === Network.Stagenet) {
      this.bnbBConnect = new BinanceBeaconClient({
        phrase: mnemonic,
        network: network,
        dojClientUrl: "https://bnb-test.h4s.dojima.network",
        // dojClientUrl: "http://localhost:26660",
      });
      // } else if (network === Network.Testnet || network === Network.Stagenet) {
      //   this.bnbBConnect = new BinanceBeaconClient({
      //     phrase: mnemonic,
      //     network: Network.Testnet,
      //   });
    } else {
      this.bnbBConnect = new BinanceBeaconClient({
        phrase: mnemonic,
      });
    }
  }
}
