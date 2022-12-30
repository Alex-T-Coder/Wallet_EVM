import { CoinGecko } from "@dojima-wallet/prices";
import { GasfeeResult, UsdtTokenGasFeeResult } from "./types";

export const getUsdtTokenPriceResult = async (
  gasFee: GasfeeResult,
  asset: string
): Promise<UsdtTokenGasFeeResult> => {
  const pricesInst = new CoinGecko();
  const pricesData = await pricesInst.getAssestsCurrentMarketData({
    assets: asset,
  });
  if (pricesData !== undefined) {
    return {
      slow: {
        fee: {
          asset_fee: gasFee.slow,
          usdt_fee: gasFee.slow * pricesData.current_price,
        },
      },
      average: {
        fee: {
          asset_fee: gasFee.average,
          usdt_fee: gasFee.average * pricesData.current_price,
        },
      },
      fast: {
        fee: {
          asset_fee: gasFee.fast,
          usdt_fee: gasFee.fast * pricesData.current_price,
        },
      },
    };
  } else {
    throw new Error("Unable to retrieve current asset-usdt price");
  }
};
