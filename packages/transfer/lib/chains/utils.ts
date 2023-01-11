import { CoinGecko } from "@dojima-wallet/prices";
import { GasfeeResult, UsdtTokenGasFeeResult } from "./types";
import BigNumber from "bignumber.js";

export const getUsdtTokenPriceResult = async (
  gasFee: GasfeeResult,
  asset: string
): Promise<UsdtTokenGasFeeResult> => {
  const pricesInst = new CoinGecko();
  let usdt_price: number;
  if (asset === ("dojima" || "hermes")) {
    usdt_price = 0.0111;
  } else {
    const pricesData = await pricesInst.getAssestsCurrentMarketData({
      assets: asset,
    });
    usdt_price = pricesData.current_price;
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
