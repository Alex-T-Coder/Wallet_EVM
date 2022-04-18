import { EthereumAccount } from "@dojima-wallet/account";
import { NetworkType } from "@dojima-wallet/types";
import { abi } from "./abi/Compound_abi";
import { contractData, tokenList } from "@dojima-wallet/non-native/";
import { AbiItem } from "web3-utils";

export default class Compound extends EthereumAccount {
  contract;
  contractAddress: string;

  constructor(
    token: tokenList,
    contract: string,
    mnemonic: string,
    network: NetworkType
  ) {
    super(mnemonic, network);
    this.contractAddress = contractData[`${token}`].contractAddress;
    this.contract = new this._web3.eth.Contract(
      abi[contract],
      this.contractAddress
    );
  }

  async redeem(cTokenAmount: number): Promise<any> {
    let result = this.contract.methods.redeem(cTokenAmount).send({
      from: this.getAddress(),
    });

    return result;
  }

  async supplyETH(amount: number): Promise<any> {
    let result = this.contract.methods.mint().send({
      from: this.getAddress(),
      value: amount,
    });

    return result;
  }

  async supply(amount: number, token: tokenList): Promise<any> {
    const underlying = new this._web3.eth.Contract(
      abi.Erc20 as AbiItem[],
      contractData[`${token}`].contractAddress
    );

    underlying.methods.approve(this.contractAddress, amount).call({
      from: this.getAddress(),
    });

    let result = this.contract.methods.mint(amount).send({
      from: this.getAddress(),
    });

    return result;
  }
}
