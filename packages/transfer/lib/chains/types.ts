export interface FeeResult {
  asset_fee: number;
  usdt_fee: number;
}

export interface UsdtTokenGasFeeResult {
  slow: {
    fee: FeeResult;
  };
  average: {
    fee: FeeResult;
  };
  fast: {
    fee: FeeResult;
  };
}

export interface GasfeeResult {
  slow: number;
  average: number;
  fast: number;
}

export type DexFee = {
  fee_name: DexFeeName;
  fee_value: number;
};

export type DexFees = {
  dex_fee_fields: DexFee[];
};

export type Fees = (Fee | TransferFee | DexFees)[];
export type FeeType =
  | "submit_proposal"
  | "deposit"
  | "vote"
  | "create_validator"
  | "remove_validator"
  | "dexList"
  | "orderNew"
  | "orderCancel"
  | "issueMsg"
  | "mintMsg"
  | "tokensBurn"
  | "tokensFreeze"
  | "send"
  | "timeLock"
  | "timeUnlock"
  | "timeRelock"
  | "setAccountFlags"
  | "HTLT"
  | "depositHTLT"
  | "claimHTLT"
  | "refundHTLT";

export type Fee = {
  msg_type: FeeType;
  fee: number;
  fee_for: number;
};
export const isTransferFee = (
  v: Fee | TransferFee | DexFees
): v is TransferFee =>
  isFee((v as TransferFee)?.fixed_fee_params) &&
  !!(v as TransferFee)?.multi_transfer_fee;
export const isFee = (v: Fee | TransferFee | DexFees): v is Fee =>
  !!(v as Fee)?.msg_type &&
  (v as Fee)?.fee !== undefined &&
  (v as Fee)?.fee_for !== undefined;

export type TransferFee = {
  fixed_fee_params: Fee;
  multi_transfer_fee: number;
  lower_limit_as_multi: number;
};

export type DexFeeName =
  | "ExpireFee"
  | "ExpireFeeNative"
  | "CancelFee"
  | "CancelFeeNative"
  | "FeeRate"
  | "FeeRateNative"
  | "IOCExpireFee"
  | "IOCExpireFeeNative";
