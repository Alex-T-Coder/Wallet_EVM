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
}
