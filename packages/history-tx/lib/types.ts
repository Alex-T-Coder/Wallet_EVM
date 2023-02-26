export interface ArTxDataType {
  transaction_hash: string;
  from: string;
  to: string;
  value: number;
  gas_price: string;
  signature: string;
}

export type OuterDataResult = {
  timestamp: string;
  transaction_hash: string;
  block: string;
  from: string;
  to: string;
  value: string;
  gas_price: string;
  date: string;
  time: string;
};

export type InnerDataResult = {
  timestamp: string;
  transaction_hash: string;
  block: string;
  from: string;
  to: string;
  value: string;
  gas_price: string;
  date: string;
  time: string;
  signature: string;
  block_hash: string;
};

export type ArTxsResult = {
  outer: OuterDataResult[];
  inner: InnerDataResult[];
};

export type ArTxs = {
  total: number;
  txs: ArTxsResult;
};

export interface BtcTxDataType {
  transaction_hash: string;
  value: string;
  date: string;
  transfer_type: string;
  from: string;
  to: string;
}

export interface BtcTxs {
  total: number;
  txs: Array<BtcTxDataType>;
}

export interface BnbTxDataType {
  transaction_hash: string;
  value: string;
  date: string;
  transfer_type: string;
  from: string;
  to: string;
}

export interface BnbTxs {
  total: number;
  txs: Array<BnbTxDataType>;
}

export interface H4sTxDataType {
  transaction_hash: string;
  value: string;
  date: string;
  transfer_type: string;
  from: string;
  to: string;
}

export interface H4sTxs {
  total: number;
  txs: Array<H4sTxDataType>;
}

export interface DojTxDataType {
  transfer_type: string;
  transaction_hash: string;
  from: string;
  to: string;
  amount: number;
  gas_fee: number;
  block_number: number;
  block_hash: string;
  gas_price: string;
  nonce: number;
}

export interface EthTxDataRes {
  blockHash: string;
  blockNumber: string;
  from: string;
  gas: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  hash: string;
  input: string;
  nonce: string;
  to: string;
  transactionIndex: string;
  value: string;
  type: string;
  accessList: [];
  chainId: string;
  v: string;
  r: string;
  s: string;
}

export interface EthTxsRes {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export interface EthTxDataType {
  transfer_type: string;
  transaction_hash: string;
  from: string;
  to: string;
  amount: number;
  gas_fee: number;
  block_number: number;
  block_hash: string;
  gas_price: string;
  nonce: number;
}

export interface EthTxsArrayResult {
  block: number;
  date: string;
  time: string;
  transaction_hash: string;
  contract_address: string;
  value: number;
  gas_price: string;
  from: string;
  to: string;
  transaction_type: string;
}

export interface EthTxs {
  total: number;
  txs: Array<EthTxsArrayResult>;
}

// export interface EthTxDataType {
//   transaction_hash: string;
//   value: string;
//   transfer_type: string;
//   from: string;
//   to: string;
//   date?: string;
//   block?: string;
//   gas_price?: string;
// }
//
// export interface EthTxs {
//   total: number;
//   txs: Array<EthTxDataType>;
// }

export interface SolTxDataType {
  transaction_hash: string;
  timeStamp: number;
  gasFee: number;
  amount: number;
  block: number;
  from: string;
  to: string;
  recentBlockHash: string;
  instructionData: string;
}

export interface SolTxs {
  total: number;
  txs: Array<SolTxDataType>;
}
