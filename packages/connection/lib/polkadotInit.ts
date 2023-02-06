import { Network } from "@dojima-wallet/types";
import { PolkadotClient } from "./polkadot";

export default class PolkaClient {
  dotConnect: PolkadotClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.DojTestnet) {
      this.dotConnect = new PolkadotClient({
        phrase: mnemonic,
        network: network,
        provider: "wss://dotws-test.h4s.dojima.network:9944",
      });
    } else if (network === Network.Testnet || network === Network.Stagenet) {
      this.dotConnect = new PolkadotClient({
        phrase: mnemonic,
        network: Network.Testnet,
      });
    } else {
      this.dotConnect = new PolkadotClient({
        phrase: mnemonic,
      });
    }
  }
}
