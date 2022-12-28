import { BinanceBeaconClient } from "./binance-beacon";
import { Network } from "@dojima-wallet/types";

export default class BinanceBeaconInit {
  bnbBConnect: BinanceBeaconClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.Testnet || network === Network.Stagenet) {
      this.bnbBConnect = new BinanceBeaconClient({
        phrase: mnemonic,
        network: network,
      });
    } else {
      this.bnbBConnect = new BinanceBeaconClient({
        phrase: mnemonic,
      });
    }
  }
}
