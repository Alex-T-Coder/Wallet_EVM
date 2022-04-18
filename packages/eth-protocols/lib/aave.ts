import { EthereumAccount } from "@dojima-wallet/account";
import { NetworkType } from "@dojima-wallet/types";
import { LENDING_POOL, WETHGateway } from "./abi/aave_V3_abi";
import { contractData, tokenList } from "@dojima-wallet/non-native/";
import { AbiItem } from "web3-utils";
import { abi } from "./abi/Compound_abi";

export default class Aave extends EthereumAccount {
  constructor(
    token: tokenList,
    contract: string,
    mnemonic: string,
    network: NetworkType
  ) {
    super(mnemonic, network);
  }

  async depositET(
    amount: number,
    lendingPoolAddress: string,
    wETHGatewayAddress: string
  ): Promise<any> {
    let chainId = await this._web3.eth.getChainId();
    console.log(chainId);

    const contract = new this._web3.eth.Contract(
      WETHGateway.abi as AbiItem[],
      wETHGatewayAddress
    );

    let result = contract.methods
      .depositETH(lendingPoolAddress, this.getAddress(), 0)
      .send({
        from: this.getAddress(),
        value: amount,
      });

    return result;
  }

  async withdrawET(
    amount: number,
    lendingPoolAddress: string,
    wETHGatewayAddress: string
  ): Promise<any> {
    const aWETHToken = new this._web3.eth.Contract(
      abi.Erc20 as AbiItem[],
      contractData.AAVE_ETH.contractAddress
    );

    aWETHToken.methods.allowance(this.getAddress(), wETHGatewayAddress).call({
      from: this.getAddress(),
    });

    aWETHToken.methods.approve(wETHGatewayAddress, amount).call({
      from: this.getAddress(),
    });

    const contract = new this._web3.eth.Contract(
      WETHGateway.abi as AbiItem[],
      wETHGatewayAddress
    );

    let result = contract.methods
      .withdrawETH(lendingPoolAddress, amount, this.getAddress(), 0)
      .send({
        from: this.getAddress(),
        value: amount,
      });

    return result;
  }

  async deposit(
    amount: number,
    token: tokenList,
    lendingPoolAddress: string,
    underlyingAssetAddress: string
  ): Promise<any> {
    const underlying = new this._web3.eth.Contract(
      abi.Erc20 as AbiItem[],
      underlyingAssetAddress
    );

    underlying.methods.allowance(this.getAddress(), lendingPoolAddress).call({
      from: this.getAddress(),
    });

    underlying.methods.approve(lendingPoolAddress, amount).call({
      from: this.getAddress(),
    });

    const contract = new this._web3.eth.Contract(
      LENDING_POOL.minAbi as AbiItem[],
      lendingPoolAddress
    );

    let result = contract.methods
      .deposit(underlyingAssetAddress, amount, this.getAddress(), 0)
      .send({
        from: this.getAddress(),
      });

    return result;
  }

  async withdraw(
    amount: number,
    token: tokenList,
    lendingPoolAddress: string,
    underlyingAssetAddress: string
  ): Promise<any> {
    const contract = new this._web3.eth.Contract(
      LENDING_POOL.minAbi as AbiItem[],
      lendingPoolAddress
    );

    let result = contract.methods
      .withdraw(underlyingAssetAddress, amount, this.getAddress())
      .send({
        from: this.getAddress(),
      });

    return result;
  }
}
