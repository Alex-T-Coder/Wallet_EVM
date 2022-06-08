import { SolanaAccount } from "@dojima-wallet/account";
import { NetworkType } from "@dojima-wallet/types";
import * as web3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { IDL } from "./dojima";
import idl from "./idl.json";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import * as splToken from "@solana/spl-token";

//Deployed solana program
const programId = new web3.PublicKey(idl.metadata.address);
const opts: web3.ConfirmOptions = {
  preflightCommitment: "processed",
};

export default class SolanaProtocols extends SolanaAccount {
  constructor(mnemonic: string, network: NetworkType) {
    super(network);
  }

  async transferNativeToken(
    toAddr: string,
    amount: number,
    srcChain: string,
    dstChain: string,
    token: string,
    fromKeyPair: web3.Keypair, //TODO: Need to add this in solana accounts package.
    fromAddr: string
  ): Promise<String> {
    //Get account address
    const fromPubKey = new web3.PublicKey(fromAddr);

    //Convert toAddress to Publickey
    const toPubKey = new web3.PublicKey(toAddr);

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
      srcChain,
      dstChain,
      token,
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

  async transferNonNativeToken(
    toAddr: string,
    mint: web3.PublicKey,
    amount: number,
    srcChain: string,
    dstChain: string,
    token: string,
    fromKeyPair: web3.Keypair,
    fromAddr: string
  ): Promise<String> {
    //Convert to address to Publickey
    const toPubKey = new web3.PublicKey(toAddr);

    //Get account address
    const fromPubKey = new web3.PublicKey(fromAddr);

    //Create a token account for the payer wallet
    const fromTokenAcc = await getOrCreateAssociatedTokenAccount(
      this._connection,
      fromKeyPair,
      mint,
      fromKeyPair.publicKey
    );

    const toTokenAcc = await getOrCreateAssociatedTokenAccount(
      this._connection,
      fromKeyPair,
      mint,
      toPubKey
    );

    const provider = new anchor.Provider(
      this._connection,
      new anchor.Wallet(fromKeyPair),
      opts
    );
    const program = new anchor.Program(IDL, programId, provider);

    // Add transaction for the required amount
    const rawTx = await program.rpc.transferNonNativeTokens(
      new anchor.BN(amount),
      srcChain,
      dstChain,
      token,
      {
        accounts: {
          from: fromPubKey,
          fromTokenAccount: fromTokenAcc.address,
          toTokenAccount: toTokenAcc.address,
          mint: mint,
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
        },
        signers: [fromKeyPair],
      }
    );

    await this._connection.confirmTransaction(rawTx);
    return rawTx;
  }
}
