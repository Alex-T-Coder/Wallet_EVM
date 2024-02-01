import { Network } from "@dojima-wallet/types";
import { SolanaClient } from "./solana";

export default class SolanaInit {
  solConnect: SolanaClient;
  constructor(mnemonic: string, network: Network, apiKey?: string) {
    if (network === Network.Testnet) {
      this.solConnect = new SolanaClient({
        phrase: mnemonic,
        network: network,
        endpoint: "https://sol-test.h4s.dojima.network",
      });
      // } else if (network === Network.Stagenet) {
      //   this.solConnect = new SolanaClient({
      //     phrase: mnemonic,
      //     network: network,
      //     endpoint: "https://sol.h4s.dojima.network",
      //   });
    } else {
      this.solConnect = new SolanaClient({
        phrase: mnemonic,
        apiKey: apiKey,
      });
    }
  }
}
