/**
 * Haskoin API types
 */

import { Address } from "@dojima-wallet/utils";

export type UtxoData = {
  txid: string;
  index: number;
  value: number;
  pkscript: string;
};

export type BalanceData = {
  address: Address;
  confirmed: number;
  unconfirmed: number;
  utxo: number;
  txs: number;
  received: number;
};
