import { Network } from "@dojima-wallet/types";
import { SolanaClient } from "./solana";

export default class SolanaInit {
  solConnect: SolanaClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.DojTestnet) {
      this.solConnect = new SolanaClient({
        phrase: mnemonic,
        network: Network.DojTestnet,
        endpoint: "https://sol-test.h4s.dojima.network:8899",
        // endpoint: "http://127.0.0.1:8899",
      });
    } else if (network === Network.Testnet || network === Network.Stagenet) {
      this.solConnect = new SolanaClient({
        phrase: mnemonic,
        network: network,
      });
    } else {
      this.solConnect = new SolanaClient({
        phrase: mnemonic,
      });
    }
  }
}
