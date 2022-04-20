import { SolanaAccount } from "@dojima-wallet/account";
import { NetworkType } from "@dojima-wallet/types";
import * as web3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { IDL } from "./dojima";
import idl from "./idl.json";

//Deployed solana program
const programId = new web3.PublicKey(idl.metadata.address);
const opts: web3.ConfirmOptions = {
  preflightCommitment: "processed",
};

export default class SolanaProtocols extends SolanaAccount {
  constructor(mnemonic: string, network: NetworkType) {
    super(mnemonic, network);
  }

  async transferNativeToken(
    toAddress: string,
    amount: number,
    sourceBlockchain: string,
    destinationBlockchain: string,
    tokenTransferred: string,
    fromKeyPair: web3.Keypair //Need to add this in solana accounts package.
  ): Promise<String> {
    //Get account address
    const fromPubKey = new web3.PublicKey(await this.getAddress());

    //Convert to address to Publickey
    const toPubKey = new web3.PublicKey(toAddress);

    const toAmount = amount * Math.pow(10, 9);
    // console.log('To Amount : ' , toAmount);

    const provider = new anchor.Provider(
      this._connection,
      new anchor.Wallet(fromKeyPair),
      opts
    );
    const program = new anchor.Program(IDL, programId, provider);

    // Add transaction for the required amount
    let rawTx = await program.rpc.transferNativeTokens(
      new anchor.BN(toAmount),
      sourceBlockchain,
      destinationBlockchain,
      tokenTransferred,
      {
        accounts: {
          from: fromPubKey,
          to: toPubKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [fromKeyPair],
      }
    );

    await this._connection.confirmTransaction(rawTx);
    return rawTx;
  }
}
