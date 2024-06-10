import { Network } from "@dojima-wallet/types";
import { FioClient } from "./fio";

export default class FioInit {
  fioConnect: FioClient;
  constructor(mnemonic: string, network: Network, apiUrl: string) {
    this.fioConnect = new FioClient({
      phrase: mnemonic,
      network: network,
      apiUrl: apiUrl,
    });
  }
}
