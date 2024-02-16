import {
  GasfeeResult,
  PoolDataResult,
  UsdtTokenGasFeeResult,
  WazirxMarketDataType,
} from "./types";
import BigNumber from "bignumber.js";
import axios from "axios";

const HermesChainUrl = "https://api-dev.h4s.dojima.network/hermeschain";
// const HermesChainUrl = "http://localhost:1317/hermeschain";

export const getUsdtTokenPriceResult = async (
  gasFee: GasfeeResult,
  asset: string
): Promise<UsdtTokenGasFeeResult> => {
  let usdt_price: number;
  if (asset === "doj" || asset === "h4s") {
    usdt_price = 0.0111;
  } else {
    const response = await axios.get(
      `https://api.wazirx.com/sapi/v1/ticker/24hr?symbol=${asset}usdt`
    );
    if (response.status === 200) {
      const result: WazirxMarketDataType = response.data;
      usdt_price = Number(result.lastPrice);
    }
  }
  if (usdt_price) {
    return {
      slow: {
        fee: {
          asset_fee: gasFee.slow,
          usdt_fee: gasFee.slow * usdt_price,
        },
      },
      average: {
        fee: {
          asset_fee: gasFee.average,
          usdt_fee: gasFee.average * usdt_price,
        },
      },
      fast: {
        fee: {
          asset_fee: gasFee.fast,
          usdt_fee: gasFee.fast * usdt_price,
        },
      },
    };
  } else {
    throw new Error("Unable to retrieve current asset-usdt price");
  }
};

export const convertAssetBNtoBaseNumber = (
  assetBNValue: BigNumber,
  decimal: number
) => {
  return Number(
    (Number(assetBNValue) / Math.pow(10, decimal)).toFixed(decimal)
  );
};

export const getPoolData = async (token: string): Promise<PoolDataResult> => {
  const response = await axios.get(`${HermesChainUrl}/pool/${token}`);
  return response.data;
};
