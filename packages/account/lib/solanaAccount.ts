import * as bip39 from "bip39";
import * as web3 from "@solana/web3.js";
import { Keypair, PublicKey } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { SolanaConnection } from "@dojima-wallet/connection";
import { NetworkType } from "@dojima-wallet/types";

export default class SolanaAccount extends SolanaConnection {
  constructor(network: NetworkType, endpoint?: string) {
    super(network, endpoint);
  }

  async getKeypair(mnemonic: string): Promise<Keypair[]> {
    const seed = bip39.mnemonicToSeedSync(mnemonic, ""); // (mnemonic, password)
    const keyPairResult: web3.Keypair[] = [];
    for (let i = 0; i < 10; i++) {
      const path = `m/44'/501'/${i}'/0'`;
      const keypair = web3.Keypair.fromSeed(
        derivePath(path, seed.toString("hex")).key
      );
      keyPairResult.push(keypair);
    }
    return keyPairResult;
  }

  async getAddress(mnemonic: string, index = 0) {
    const keypair = await this.getKeypair(mnemonic);
    const address = keypair[index].publicKey.toBase58();
    return address;
  }

  async getBalance(pubAddress: string): Promise<number> {
    // Get account details
    const pubKey = new PublicKey(pubAddress);

    // Retrieve user token balance
    let balance = await this._connection.getBalance(pubKey);
    balance = balance / Math.pow(10, 9);
    return balance;
  }
}
