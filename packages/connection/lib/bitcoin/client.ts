import BigNumber from "bignumber.js";
import * as bip39 from "bip39";
import { FeeOption } from "./types/fees";
import BTCTxClient from "./transaction";
import * as utils from "./utils";
import axios from "axios";
import { HaskoinBalanceResult, BtcRawTransactionResult } from "./types/client";
// import { SochainBalanceResult } from "./types/client";
import * as Bitcoin from "bitcoinjs-lib";
import { NetworkType } from "@dojima-wallet/types";

export default class BitcoinClient extends BTCTxClient {
  _network: NetworkType;
  sochainUrl: string;
  haskoinUrl: string;
  _derivationPath: string;
  constructor(network: NetworkType) {
    super(network);
    this._network = network;
    this.sochainUrl = "https://sochain.com/api/v2";
    if (network === "mainnet" || network === "devnet") {
      this.haskoinUrl = "https://api.haskoin.com/btc";
      this._derivationPath = `84'/0'/0'/0/`;
    } else {
      this.haskoinUrl = "https://api.haskoin.com/btctest";
      this._derivationPath = `84'/1'/0'/0/`;
    }
  }

  getAddress(mnemonic: string): string {
    const btcNetwork = utils.btcNetwork(this._network);
    const btcKeys = this.getBtcKeys(mnemonic, 0);

    const { address } = Bitcoin.payments.p2wpkh({
      pubkey: btcKeys.publicKey,
      network: btcNetwork,
    });

    if (!address) {
      throw new Error("Address not defined");
    } else {
      return address;
    }
  }

  async getBalance(address: string, confirmed?: boolean): Promise<number> {
    // Haskoin Api
    try {
      let requestApi = `${this.haskoinUrl}/address/${address}/balance`;
      let response = await axios.get(requestApi);
      let result: HaskoinBalanceResult = response.data;
      const balance = confirmed
        ? result.confirmed
        : result.confirmed + result.unconfirmed;
      return balance / Math.pow(10, 8);
    } catch (error) {
      throw new Error("Something went wrong");
    }

    // Sochain Api
    // try {
    //   let requestApi = `${
    //     this.sochainUrl
    //   }/get_address_balance/${utils.toSochainNetwork(
    //     this._network
    //   )}/${address}`;
    //   let response = await axios.get(requestApi);
    //   let result: SochainBalanceResult = response.data;
    //   if (result.status === "success") {
    //     const balance = confirmed
    //       ? Number(result.data.confirmed_balance)
    //       : Number(result.data.confirmed_balance) +
    //         Number(result.data.unconfirmed_balance);
    //     return balance;
    //   } else {
    //     throw new Error("Something went wrong");
    //   }
    // } catch (error) {
    //   throw new Error("Something went wrong");
    // }
  }

  validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
  }

  getSeed(mnemonic: string): Buffer {
    if (!this.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic");
    }

    return bip39.mnemonicToSeedSync(mnemonic);
  }

  private getBtcKeys(mnemonic: string, index: number): Bitcoin.ECPairInterface {
    const btcNetwork = utils.btcNetwork(this._network);

    const seed = this.getSeed(mnemonic);
    const master = Bitcoin.bip32
      .fromSeed(seed, btcNetwork)
      .derivePath(`${this._derivationPath}${index}`);

    if (!master.privateKey) {
      throw new Error("Unable to retrieve private key from mnemonic");
    }

    return Bitcoin.ECPair.fromPrivateKey(master.privateKey, {
      network: btcNetwork,
    });
  }

  async createTransaction(
    amount: number,
    sender: string,
    recipient: string,
    mnemonic: string,
    feeRate?: number,
    memo?: string,
    walletIndex?: number
  ): Promise<BtcRawTransactionResult> {
    // Convert amount to BigNumber
    const toAmount = new BigNumber(amount * Math.pow(10, 8));

    const feeRateValue = feeRate || (await this.getFeeRates())[FeeOption.Fast];

    const fromAddressIndex = 0;
    const memoString = memo ? memo : undefined;
    const { psbt } = await this.buildTx(
      toAmount,
      recipient,
      sender,
      this._network,
      this.sochainUrl,
      this.haskoinUrl,
      feeRateValue,
      memoString,
      false,
      false,
      fromAddressIndex
    );
    const btcKeys = this.getBtcKeys(mnemonic, fromAddressIndex);
    psbt.signAllInputs(btcKeys); // Sign all inputs
    psbt.finalizeAllInputs(); // Finalise inputs
    const extractedTx = psbt.extractTransaction();
    const txHex = extractedTx.toHex(); // TX extracted and formatted to hex
    const result: BtcRawTransactionResult = {
      tx_hex: txHex,
      gas_fee: psbt.getFee() / Math.pow(10, 8),
    };
    return result;
  }

  async transfer(txHex: string): Promise<string> {
    return await this.broadcastTx(txHex, this.haskoinUrl);
  }
}
