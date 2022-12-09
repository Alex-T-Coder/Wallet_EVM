import Web3 from "web3";
import { NetworkType } from "@dojima-wallet/types";

export default class EthereumWeb3 {
  _network: NetworkType;
  _api: string;
  _providerRpcUrl: string;
  public _web3: Web3;
  constructor(network: NetworkType) {
    this._network = network;
    if (this._network === "testnet") {
      // For testnet using goerli network with infura
      this._providerRpcUrl =
        "https://goerli.infura.io/v3/f37faaf5ddeb4e589d6f26300ed673a6";
      this._api = "https://api-goerli.etherscan.io/api";
    } else if (this._network === "devnet") {
      this._providerRpcUrl =
        "https://goerli.infura.io/v3/f37faaf5ddeb4e589d6f26300ed673a6";
      this._api = "https://api.etherscan.io/api";
    } else {
      this._providerRpcUrl =
        "https://mainnet.infura.io/v3/f37faaf5ddeb4e589d6f26300ed673a6";
      this._api = "https://api.etherscan.io/api";
    }
    this._web3 = new Web3(
      new Web3.providers.HttpProvider(this._providerRpcUrl)
    );
  }
}
