import { ArweaveAccount } from "@dojima-wallet/account";
import { NetworkType } from "@dojima-wallet/types";
import Arweave from "arweave";
import GQLResultInterface, {
  GQLTransactionsResultInterface,
} from "./utils/gqlResult";

export interface ReqVariables {
  ownersFilter: Array<string>;
  first: number;
  after?: string;
}

export default class ArweaveTxs extends ArweaveAccount {
  hasNextPage: boolean;
  cursor: string;
  constructor(mnemonic: string, network: NetworkType) {
    super(mnemonic, network);
    this.hasNextPage = false;
    this.cursor = "";
  }

  async getTxs(after?: string) {
    // const owner: string = await this.getAddress()
    let variables: ReqVariables = {
      ownersFilter: ["4JOmaT9fFe2ojFJEls3Zow5UKO2CBOk7lOirbPTtX1o"],
      first: 100,
      after,
    };

    const txs = await this.getNextPage(this._arweave, variables);
    return txs;
  }

  async getNextPage(
    arweave: Arweave,
    variables: ReqVariables
  ): Promise<GQLTransactionsResultInterface> {
    const query = `query Transactions($ownersFilter: [String!], $first: Int!, $after: String) {
          transactions(owners: $ownersFilter, first: $first, sort: HEIGHT_ASC, after: $after) {
            pageInfo {
              hasNextPage
            }
            edges {
              node {
                id
                owner { address }
                recipient
                tags {
                  name
                  value
                }
                block {
                  height
                  id
                  timestamp
                }
                fee { winston }
                quantity { winston }
                parent { id }
              }
              cursor
            }
          }
        }`;

    const response = await arweave.api.post("graphql", {
      query,
      variables,
    });

    if (response.status !== 200) {
      throw new Error(
        `Unable to retrieve transactions. Arweave gateway responded with status ${response.status}.`
      );
    }

    const data: GQLResultInterface = response.data;
    const txs = data.data.transactions;

    return txs;
  }
}
