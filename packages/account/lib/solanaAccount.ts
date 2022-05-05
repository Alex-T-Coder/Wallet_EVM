import * as bip39 from "bip39";
import * as web3 from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { SolanaConnection } from "@dojima-wallet/connection";
import { NetworkType } from "@dojima-wallet/types";

export default class SolanaAccount extends SolanaConnection {
  constructor(mnemonic: string, network: NetworkType) {
    super(mnemonic, network);
  }

  async getKeypair(): Promise<Keypair[]> {
    const seed = bip39.mnemonicToSeedSync(this._mnemonic, ""); // (mnemonic, password)
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

  async getAddress() {
    const keypair = await this.getKeypair();
    const address = keypair[0].publicKey.toBase58();
    return address;
  }
}
