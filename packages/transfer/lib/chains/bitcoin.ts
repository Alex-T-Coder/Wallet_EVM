// import { Network } from "@dojima-wallet/types";
// import { BitcoinInit, BTC_DECIMAL } from "@dojima-wallet/connection";
// import { getUsdtTokenPriceResult } from "./utils";
// import { UsdtTokenGasFeeResult } from "./types";
// import { assetAmount, AssetBTC, assetToBase } from "@dojima-wallet/utils";
//
// export default class BitcoinChain extends BitcoinInit {
//   constructor(mnemonic: string, network: Network) {
//     super(mnemonic, network);
//   }
//
//   async getGasFee(): Promise<UsdtTokenGasFeeResult> {
//     // const gasFee = await this.btcConnect.getFees();
//     const rates = await this.btcConnect.getFeeRates();
//     // const btc_gasFee = {
//     //   slow: convertAssetBNtoBaseNumber(gasFee.average.amount(), BTC_DECIMAL),
//     //   average: convertAssetBNtoBaseNumber(gasFee.fast.amount(), BTC_DECIMAL),
//     //   fast: convertAssetBNtoBaseNumber(gasFee.fastest.amount(), BTC_DECIMAL),
//     // };
//     const btc_gasPrice = {
//       slow: rates.average / Math.pow(10, BTC_DECIMAL),
//       average: rates.fast / Math.pow(10, BTC_DECIMAL),
//       fast: rates.fastest / Math.pow(10, BTC_DECIMAL),
//     };
//     const result = await getUsdtTokenPriceResult(btc_gasPrice, "btc");
//     return result;
//   }
//
//   async transfer(
//     recipient: string,
//     amount: number,
//     feeRate?: number
//   ): Promise<string> {
//     const baseAmt = assetToBase(assetAmount(amount, BTC_DECIMAL));
//     const hash = await this.btcConnect.transfer({
//       recipient,
//       amount: baseAmt,
//       asset: AssetBTC,
//       feeRate,
//     });
//     return hash;
//   }
// }
