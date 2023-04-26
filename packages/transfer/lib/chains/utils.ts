import {
  AssetsDetailedBexCurrentMarketDataResultObject,
  GasfeeResult,
  PoolDataResult,
  UsdtTokenGasFeeResult,
} from "./types";
import BigNumber from "bignumber.js";
import axios from "axios";

const HermesChainUrl = "https://api-test.h4s.dojima.network/hermeschain";
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
      `https://fiber-test.h4s.dojima.network/api/v1/coinmarket/${asset}`
    );
    const result: AssetsDetailedBexCurrentMarketDataResultObject =
      response.data;
    usdt_price = result.data.current_price;
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
