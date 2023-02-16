import { EthereumClient } from "./ethereum";
import { Network } from "@dojima-wallet/types";

export default class EthereumInit {
  ethConnect: EthereumClient;
  constructor(mnemonic: string, network: Network) {
    if (network === Network.DojTestnet) {
      this.ethConnect = new EthereumClient({
        phrase: mnemonic,
        network: Network.DojTestnet,
        // rpcUrl: "https://eth-test.h4s.dojima.network:9545/",
        // rpcUrl: "https://eth-test.h4s.dojima.network/",
        rpcUrl: "http://localhost:9545",
      });
    } else if (network === Network.Testnet || network === Network.Stagenet) {
      this.ethConnect = new EthereumClient({
        phrase: mnemonic,
        network: Network.Testnet,
        rpcUrl: "https://goerli.infura.io/v3/",
        // infuraApiKey: 'f37faaf5ddeb4e589d6f26300ed673a6',
      });
    } else {
      this.ethConnect = new EthereumClient({
        phrase: mnemonic,
      });
    }
    // if (network === Network.Testnet || network === Network.Stagenet) {
    //   this.ethConnect = new EthereumClient({
    //     phrase: mnemonic,
    //     network: Network.Testnet,
    //     etherscanApiKey: "6IU4JG5P2PNVRSB54YIAMIAQFQ879PXJ7C",
    //     ethplorerApiKey: "EK-aUaYx-fDc6bNC-WfsGG",
    //   });
    // } else {
    //   this.ethConnect = new EthereumClient({
    //     phrase: mnemonic,
    //     etherscanApiKey: "6IU4JG5P2PNVRSB54YIAMIAQFQ879PXJ7C",
    //     ethplorerApiKey: "EK-aUaYx-fDc6bNC-WfsGG",
    //   });
    // }
  }
}
