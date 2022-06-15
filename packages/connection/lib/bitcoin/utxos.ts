import { NetworkType } from "@dojima-wallet/types";
import { assetAmount, baseAmount } from "@xchainjs/xchain-util";
import axios from "axios";
import BTCFeesClient from "./fees";
import {
  SochainResponse,
  TxConfirmedStatus,
  UtxoData,
  BtcAddressUTXO,
  BtcUnspentTxsDTO,
  UTXO,
  SochainTransaction,
} from "./types/utxos";
import * as utils from "./utils";

export default class BTCUtxosClient extends BTCFeesClient {
  constructor(network: NetworkType) {
    super(network);
  }

  confirmedTxs: Array<string> = [];
  txHexMap: Record<string, string> = {};

  async getConfirmedTxStatus(
    sochainUrl: string,
    txHash: string,
    network: NetworkType
  ): Promise<boolean> {
    // try to get it from cache
    if (this.confirmedTxs.includes(txHash)) return true;
    // or get status from Sochain
    const { is_confirmed } = await this.getIsTxConfirmed(
      sochainUrl,
      network,
      txHash
    );
    // cache status
    this.confirmedTxs.push(txHash);
    return is_confirmed;
  }

  async getIsTxConfirmed(
    sochainUrl: string,
    network: NetworkType,
    hash: string
  ): Promise<TxConfirmedStatus> {
    const { data } = await axios.get<SochainResponse<TxConfirmedStatus>>(
      `${sochainUrl}/is_tx_confirmed/${utils.toSochainNetwork(network)}/${hash}`
    );
    return data.data;
  }

  async getTxHex(
    sochainUrl: string,
    txHash: string,
    network: NetworkType
  ): Promise<string> {
    // try to get hex from cache
    const txHex = this.txHexMap[txHash];
    if (!!txHex) return txHex;
    // or get it from Sochain
    const { tx_hex } = await this.getTx(sochainUrl, txHash, network);
    // cache it
    this.txHexMap[txHash] = tx_hex;
    return tx_hex;
  }

  async getTx(
    sochainUrl: string,
    txHash: string,
    network: NetworkType
  ): Promise<SochainTransaction> {
    const url = `${sochainUrl}/get_tx/${utils.toSochainNetwork(
      network
    )}/${txHash}`;
    const response = await axios.get(url);
    const tx: SochainResponse<SochainTransaction> = response.data;
    return tx.data;
  }

  async getHaskoinConfirmedUnspentTxs(
    haskoinUrl: string,
    sochainUrl: string,
    address: string,
    network: NetworkType
  ): Promise<UtxoData[]> {
    const allUtxos = await this.getHaskoinUnspentTxs(haskoinUrl, address);

    const confirmedUTXOs: UtxoData[] = [];

    await Promise.all(
      allUtxos.map(async (tx: UtxoData) => {
        const confirmed = await this.getConfirmedTxStatus(
          sochainUrl,
          tx.txid,
          network
        );

        if (confirmed) {
          confirmedUTXOs.push(tx);
        }
      })
    );

    return confirmedUTXOs;
  }

  async getHaskoinUnspentTxs(
    haskoinUrl: string,
    address: string
  ): Promise<UtxoData[]> {
    const { data: response } = await axios.get<UtxoData[]>(
      `${haskoinUrl}/address/${address}/unspent`
    );

    return response;
  }

  async getConfirmedUnspentTxs(
    sochainUrl: string,
    network: NetworkType,
    address: string
  ): Promise<BtcAddressUTXO[]> {
    const txs = await this.getUnspentTxs(sochainUrl, network, address);

    const confirmedUTXOs: BtcAddressUTXO[] = [];

    await Promise.all(
      txs.map(async (tx: BtcAddressUTXO) => {
        const confirmed = await this.getConfirmedTxStatus(
          sochainUrl,
          tx.txid,
          network
        );

        if (confirmed) {
          confirmedUTXOs.push(tx);
        }
      })
    );

    return confirmedUTXOs;
  }

  async getUnspentTxs(
    sochainUrl: string,
    network: NetworkType,
    address: string,
    startingFromTxId?: string
  ): Promise<BtcAddressUTXO[]> {
    const api = `${sochainUrl}/get_tx_unspent/${utils.toSochainNetwork(
      network
    )}/${address}/${startingFromTxId ? startingFromTxId : null}`;
    const resp = await axios.get(api);
    const response: SochainResponse<BtcUnspentTxsDTO> = resp.data;
    const txs = response.data.txs;
    if (txs.length === 100) {
      //fetch the next batch
      const lastTxId = txs[99].txid;

      const nextBatch = await this.getUnspentTxs(
        sochainUrl,
        network,
        address,
        lastTxId
      );
      return txs.concat(nextBatch);
    } else {
      return txs;
    }
  }

  async scanUTXOs(
    sochainUrl: string,
    haskoinUrl: string,
    network: NetworkType,
    address: string,
    confirmedOnly = true, // default: scan only confirmed UTXOs
    withTxHex = false
  ): Promise<UTXO[]> {
    switch (network) {
      case "testnet": {
        // Get UTXOs from Sochain
        const utxos: BtcAddressUTXO[] = confirmedOnly
          ? await this.getConfirmedUnspentTxs(sochainUrl, network, address)
          : await this.getUnspentTxs(sochainUrl, network, address);

        return await Promise.all(
          utxos.map(async (utxo) => ({
            hash: utxo.txid,
            index: utxo.output_no,
            value: utils
              .assetToBase(assetAmount(utxo.value, 8))
              .amount()
              .toNumber(),
            witnessUtxo: {
              value: utils
                .assetToBase(assetAmount(utxo.value, 8))
                .amount()
                .toNumber(),
              script: Buffer.from(utxo.script_hex, "hex"),
            },
            txHex: withTxHex
              ? await this.getTxHex(sochainUrl, utxo.txid, network)
              : undefined,
          }))
        );
      }
      case "mainnet":
      case "devnet": {
        // Get UTXOs from Haskoin
        const utxos: UtxoData[] = confirmedOnly
          ? await this.getHaskoinConfirmedUnspentTxs(
              address,
              haskoinUrl,
              sochainUrl,
              network
            )
          : await this.getHaskoinUnspentTxs(address, haskoinUrl);

        return await Promise.all(
          utxos.map(async (utxo) => ({
            hash: utxo.txid,
            index: utxo.index,
            value: baseAmount(utxo.value, 8).amount().toNumber(),
            witnessUtxo: {
              value: baseAmount(utxo.value, 8).amount().toNumber(),
              script: Buffer.from(utxo.pkscript, "hex"),
            },
            txHex: withTxHex
              ? await this.getTxHex(sochainUrl, utxo.txid, network)
              : undefined,
          }))
        );
      }
    }
  }
}
