import { EthereumWeb3 } from "@dojima-wallet/connection";
import { NetworkType } from "@dojima-wallet/types";
import * as ethers from "ethers";

export default class EthereumAccount extends EthereumWeb3 {
  constructor(network: NetworkType) {
    super(network);
  }

  getAddress(mnemonic: string): string {
    const account = ethers.Wallet.fromMnemonic(mnemonic);
    const address = account.address;
    return address;
  }

  async getBalance(pubAddress: string): Promise<number> {
    const gweiBalance = await this._web3.eth.getBalance(pubAddress);
    // Results balance in gwei, 1 eth = 10^9 gwei(1,000,000,000)

    const ethBalance = this._web3.utils.fromWei(gweiBalance);
    // Results balance in gwei, 1 eth = 10^9 gwei(1,000,000,000)

    return Number(ethBalance);
  }
}
