export type binanceBalance = {
  /**
   * asset symbol, e.g. BNB
   */
  symbol: string;
  /**
   * In decimal form, e.g. 0.00000000
   */
  free: string;
  /**
   * In decimal form, e.g. 0.00000000
   */
  locked: string;
  /**
   * In decimal form, e.g. 0.00000000
   */
  frozen: string;
};
