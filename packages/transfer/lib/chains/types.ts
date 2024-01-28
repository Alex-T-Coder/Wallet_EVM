export type PoolDataResult = {
  balance_doj: string;
  balance_asset: string;
  asset: string;
  LP_units: string;
  pool_units: string;
  status: string;
  synth_units: string;
  synth_supply: string;
  pending_inbound_doj: string;
  pending_inbound_asset: string;
};

export type PoolData = {
  balance_doj: string;
  balance_asset: string;
  asset: string;
  LP_units: string;
  pool_units: string;
  status: string;
  synth_units: string;
  synth_supply: string;
  pending_inbound_doj: string;
  pending_inbound_asset: string;
  decimals?: number;
};

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

export type ROI = {
  times: number;
  currency: string;
  percentage: number;
};

export type AssetsDetailedBexCurrentMarketDataResult = {
  s_id: string;
  timestamp: string;
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | undefined;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | undefined;
  max_supply: number | undefined;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: ROI | undefined;
  last_updated: string;
};

export type AssetsDetailedBexCurrentMarketDataResultObject = {
  data: AssetsDetailedBexCurrentMarketDataResult;
  message: string;
  status: string;
};

export type WazirxMarketDataType = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  openPrice: string;
  lowPrice: string;
  highPrice: string;
  lastPrice: string;
  volume: string;
  bidPrice: string;
  askPrice: string;
  at: number;
};
