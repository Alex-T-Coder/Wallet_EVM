export type TransactionParam = {
  address: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
  offset?: number;
};

export interface BnbGetTranscationHistroyArray {
  txHash: string;
  blockHeight: number;
  txType: string;
  timeStamp: string;
  fromAddr: string;
  toAddr: string;
  value: string;
  txAssest: string;
  txFee: string;
}
export interface BnbGetTranscationHistroyFinalResult {
  txs: Array<BnbGetTranscationHistroyArray>;
}
