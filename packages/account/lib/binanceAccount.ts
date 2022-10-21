import { BinanceClient } from "@dojima-wallet/connection";
import { NetworkType } from "@dojima-wallet/types";
import { binanceBalance } from "./utils/binance";

export default class BinanceAccount extends BinanceClient {
  constructor(network: NetworkType) {
    super(network);
  }

  getAddress(mnemonic: string) {
    const account = this._client.recoverAccountFromMnemonic(mnemonic);
    return account.address;
  }

  async getBalance(address: string) {
    const balances: binanceBalance[] = await this._client.getBalance(address);
    return balances[0].free;
  }
}
