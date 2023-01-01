import { Network } from "@dojima-wallet/types";
import { UsdtTokenGasFeeResult } from "./types";
import { SolanaInit } from "@dojima-wallet/connection";
import { getUsdtTokenPriceResult } from "./utils";

export default class SolanaChain extends SolanaInit {
  constructor(mnemonic: string, network: Network) {
    super(mnemonic, network);
  }

  async getGasFee(): Promise<UsdtTokenGasFeeResult> {
    const gasFee = await this.solConnect.getFees();
    const sol_gasFee = {
      slow: gasFee.slow,
      average: gasFee.average,
      fast: gasFee.fast,
    };
    const result = await getUsdtTokenPriceResult(sol_gasFee, "solana");
    return result;
  }

  async transfer(recipient: string, amount: number): Promise<string> {
    const hash = await this.solConnect.transfer({
      recipient,
      amount,
    });
    return hash;
  }
}
