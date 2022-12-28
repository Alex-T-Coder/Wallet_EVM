import { Network } from "@dojima-wallet/types";
import { BitcoinClient } from "./bitcoin";

export default class BitcoinInit {
  btcConnect: BitcoinClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.Testnet || network === Network.Stagenet) {
      this.btcConnect = new BitcoinClient({
        phrase: mnemonic,
        network: network,
      });
    } else {
      this.btcConnect = new BitcoinClient({
        phrase: mnemonic,
      });
    }
  }
}
