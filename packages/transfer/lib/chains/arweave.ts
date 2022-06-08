import { getKeyFromMnemonic } from "arweave-mnemonic-keys";
import { NetworkType } from "@dojima-wallet/types/dist/lib/network";
import { ArweaveAccount } from "@dojima-wallet/account";
import Transaction from "arweave/node/lib/transaction";

export default class ArweaveChain extends ArweaveAccount {
  _mnemonic: string;
  constructor(mnemonic: string, network: NetworkType) {
    super(network);
    this._mnemonic = mnemonic;
  }

  // Create transaction based on user inputs
  async createTransaction(
    toAddress: string,
    amount: number
  ): Promise<Transaction> {
    const pvtKey = await getKeyFromMnemonic(this._mnemonic);

    // Create transaction
    const rawTx = await this._arweave.createTransaction(
      {
        target: toAddress, // Receiver address
        quantity: this._arweave.ar.arToWinston(amount.toString()), // Amount to transfer in Ar
      },
      pvtKey
    );

    return rawTx;
  }

  // Calculate gasFee required for transaction
  getGasFee(rawTx: Transaction) {
    // Gas fee generated by default during 'createTransaction'
    const gasFee = Number(rawTx.reward);
    return {
      slow: {
        fee: gasFee,
      },
      average: {
        fee: gasFee,
      },
      fast: {
        fee: gasFee,
      },
    };
  }

  // Sign and Send the transaction
  async signAndSend(rawTx: Transaction) {
    const pvtKey = await getKeyFromMnemonic(this._mnemonic);

    // Sign transaction and retreive status
    await this._arweave.transactions.sign(rawTx, pvtKey);
    const status = await this._arweave.transactions.post(rawTx);
    await this._arweave.api.get("/mine");

    if (status.status == 200) {
      // Get status data using transaction hash / id
      // const statusData = await arweave.transactions.getStatus(rawTx.id);

      // console.log(JSON.stringify(statusData));

      return rawTx.id;
    } else {
      throw new Error(
        "Error in status: Posting the transaction into arweave transactions"
      );
    }
  }
}
