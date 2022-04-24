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
const opts = {
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
    fromWallet: web3.Keypair //Need to add this in solana accounts package.
  ): Promise<String> {
    //Get account address
    const fromPubKey = new web3.PublicKey(await this.getAddress());

    //Convert to address to Publickey
    const toPubKey = new web3.PublicKey(toAddress);

    const toAmount = amount * Math.pow(10, 9);
    // console.log('To Amount : ' , toAmount);

    const provider = new anchor.Provider(
      this._connection,
      new anchor.Wallet(fromWallet),
      // @ts-ignore
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
        signers: [fromWallet],
      }
    );

    await this._connection.confirmTransaction(rawTx);
    return rawTx;
  }

  async transferNonNativeToken(
    fromWallet: web3.Keypair,
    mint: web3.PublicKey,
    toAddress: string,
    amount: number,
    sourceBlockchain: string,
    destinationBlockchain: string,
    tokenTransferred: string
  ): Promise<String> {
    //Convert to address to Publickey
    const toPubKey = new web3.PublicKey(toAddress);

    //Get account address
    const fromPubKey = new web3.PublicKey(await this.getAddress());

    //Create a token account for the payer wallet
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      this._connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      this._connection,
      fromWallet,
      mint,
      toPubKey
    );

    const provider = new anchor.Provider(
      this._connection,
      new anchor.Wallet(fromWallet),
      // @ts-ignore
      opts
    );
    const program = new anchor.Program(IDL, programId, provider);

    // Add transaction for the required amount
    const rawTx = await program.rpc.transferNonNativeTokens(
      new anchor.BN(amount),
      sourceBlockchain,
      destinationBlockchain,
      tokenTransferred,
      {
        accounts: {
          from: fromPubKey,
          fromTokenAccount: fromTokenAccount.address,
          toTokenAccount: toTokenAccount.address,
          mint: mint,
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
        },
        signers: [fromWallet],
      }
    );

    await this._connection.confirmTransaction(rawTx);
    return rawTx;
  }
}
