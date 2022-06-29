import { NetworkType } from "@dojima-wallet/types";
import { ArweaveInitialise } from "@dojima-wallet/connection";
import crypto from "libp2p-crypto";
const humanCryptoKeys = require("human-crypto-keys");

export interface KeypairResult {
  kty: string;
  n: string;
  e: string;
  d: string;
  p: string;
  q: string;
  dp: string;
  dq: string;
  qi: string;
  kid: string;
}

export default class ArweaveAccount extends ArweaveInitialise {
  constructor(network: NetworkType) {
    super(network);
  }

  /**
   * Generate a 12 word mnemonic for an Arweave key
   * @returns {string} - a promise resolving to a 12 word mnemonic seed phrase
   */
  async generateMnemonic(): Promise<string> {
    let keys = await humanCryptoKeys.generateKeyPair(
      { id: "rsa", modulusLength: 4096 },
      { privateKeyFormat: "pkcs1-pem" }
    );
    return keys.mnemonic;
  }

  /**
   * Generates a JWK object representation of an Arweave key
   * @param mnemonic - a 12 word mnemonic represented as a string
   * @returns {object} - returns a Javascript object that conforms to the JWKInterface required by Arweave-js
   *
   * @example <caption>Generate an Arweave key and get its public address</caption>
   * let key = getKeyFromMnemonic('jewel cave spy act loyal solid night manual joy select mystery unhappy')
   * arweave.wallets.jwkToAddress(key)
   * //returns qe741op_rt-iwBazAqJipTc15X8INlDCoPz6S40RBdg
   *
   */
  async getKeyFromMnemonic(mnemonic: string): Promise<KeypairResult> {
    let keyPair = await humanCryptoKeys.getKeyPairFromMnemonic(
      mnemonic,
      { id: "rsa", modulusLength: 4096 },
      { privateKeyFormat: "pkcs1-pem" }
    );
    //@ts-ignore
    let privateKey = (await crypto.keys.import(keyPair.privateKey, ""))._key;
    delete privateKey.alg;
    delete privateKey.key_ops;
    return privateKey;
  }

  async getAddress(mnemonic: string): Promise<string> {
    // Get 'public address' from Seed phrase
    const key = await this.getKeyFromMnemonic(mnemonic);
    const address = await this._arweave.wallets.jwkToAddress(key);
    return address;
  }

  async mintArTokens(pubAddress: string) {
    // testnet tokens in winston
    const test_ar_amount = 5000000000000;

    // Mint balance in Arlocal for testing
    await this._arweave.api.get(`/mint/${pubAddress}/${test_ar_amount}`);
    await this._arweave.api.get("/mine");
  }

  async getBalance(pubAddress: string): Promise<number> {
    // Get Winston balance of an account using public address
    let wnstBalance = await this._arweave.wallets.getBalance(pubAddress);

    // Convert balance from Winston to Ar. (1 Ar = 10^12)
    const arBalance = this._arweave.ar.winstonToAr(wnstBalance);

    return Number(arBalance);
  }
}
