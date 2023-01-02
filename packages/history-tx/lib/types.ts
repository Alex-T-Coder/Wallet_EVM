export interface ArTxDataType {
  transaction_hash: string;
  from: string;
  to: string;
  value: number;
  gas_price: string;
  signature: string;
}

export interface OuterDataResult {
  timestamp: number;
  transaction_hash: string;
  block: number;
  from: string;
  to: string;
  value: string;
  gas_price: string;
  date: string;
  time: string;
}

export interface InnerDataResult {
  timestamp: number;
  transaction_hash: string;
  block: number;
  from: string;
  to: string;
  value: string;
  gas_price: string;
  date: string;
  time: string;
  signature: string;
  block_hash: string;
}

export interface ArTxsResult {
  outer: OuterDataResult[];
  inner: InnerDataResult[];
}

export interface ArTxs {
  total: number;
  txs: ArTxsResult;
}

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
  txs: Array<BtcTxDataType>;
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
  transaction_hash: string;
  value: string;
  transfer_type: string;
  from: string;
  to: string;
  date?: string;
  block?: string;
  gas_price?: string;
}

export interface EthTxs {
  total: number;
  txs: Array<EthTxDataType>;
}

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
