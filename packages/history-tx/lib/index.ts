import BitcoinTransactions from "./bitcoin";
import EthereumTransactions from "./ethereum";
import SolanaTransactions from "./solana";
import ArweaveTxs from "./arweave";
import { ArTxDataResult, ArTxsResult } from "./utils/gqlResult";
import {
  SolTxHistoryParams,
  SolTxsResult,
  SolTxDataResult,
  EthTxDataResult,
  EthTxsResult,
  TxHashDataParams,
  TxHistoryParams,
  BtcTxDataResult,
  BtcTxsResult,
  BtcTxHistoryParams,
} from "./utils/types";

export {
  ArTxDataResult,
  ArTxsResult,
  BtcTxHistoryParams,
  BtcTxsResult,
  BtcTxDataResult,
  TxHistoryParams,
  EthTxsResult,
  TxHashDataParams,
  EthTxDataResult,
  SolTxHistoryParams,
  SolTxsResult,
  SolTxDataResult,
};

export {
  BitcoinTransactions,
  EthereumTransactions,
  SolanaTransactions,
  ArweaveTxs,
};
