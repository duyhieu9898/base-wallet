import { Contract } from 'ethers';
import { TransactionResponse } from 'ethers/providers';
import { bnum } from '../../utils/helpers';
import { networkConnectors } from '../../provider/networkConnectors';
import { ChainId } from '../../constants';
// import Web3 from 'web3';
// import { abi as BPoolABI } from '../../abi/BPool.json';
// import { abi as routerABI } from '../../abi/ExchangeProxy.json';

interface ActionRequest {
  contract: Contract;
  action: string;
  sender: string;
  data: any[];
  overrides: any;
}

export interface ActionResponse {
  contract: Contract;
  action: string;
  sender: string;
  data: object;
  txResponse: TransactionResponse | undefined;
  error: any | undefined;
}

const preLog = (params: ActionRequest) => {
  console.log(`[@action start: ${params.action}]`, {
    contract: params.contract,
    action: params.action,
    sender: params.sender,
    data: JSON.parse(JSON.stringify(params.data || '')),
    overrides: params.overrides,
  });
};

const postLog = (result: ActionResponse) => {
  console.log(`[@action end: ${result.action}]`, {
    contract: result.contract,
    action: result.action,
    sender: result.sender,
    data: JSON.parse(JSON.stringify(result.data || '')),
    result: result.txResponse,
    error: result.error,
  });
};

export const sendAction = async (
  params: ActionRequest
): Promise<ActionResponse> => {
  const { contract, action, sender, data, overrides } = params;
  preLog(params);

  const actionResponse: ActionResponse = {
    contract,
    action,
    sender,
    data,
    txResponse: undefined,
    error: undefined,
  };

  try {
    // if (action === 'exitPool') {
    //   let enabled = false;
    //   // Modern dapp browsers...
    //   if (window.ethereum) {
    //     window.web3 = new Web3(window.ethereum);
    //     try {
    //       // Request account access if needed
    //       await window.ethereum.enable();
    //       enabled = true;
    //     } catch (error) {
    //       // User denied account access...
    //     }
    //   }
    //   // Legacy dapp browsers...
    //   else if (window.web3) {
    //     window.web3 = new Web3(window.web3.currentProvider);
    //     enabled = true;
    //   }
    //   // Non-dapp browsers...
    //   else {
    //     console.log(
    //       'Non-Ethereum browser detected. You should consider trying MetaMask!'
    //     );
    //   }
    //   if (enabled) {
    //     const web3Contract = new window.web3.eth.Contract(
    //       BPoolABI,
    //       contract.address
    //     );
    //     await new Promise(async resolve => {
    //       web3Contract.methods.exitPool
    //         .apply(null, data)
    //         .send({
    //           from: sender,
    //           gasPrice: await window.web3.eth.getGasPrice(),
    //         })
    //         .on('transactionHash', txId => {
    //           actionResponse.txResponse = { hash: txId } as TransactionResponse;
    //           resolve(txId);
    //         })
    //         .on('error', e => {
    //           actionResponse.error = e;
    //           resolve(null);
    //         });
    //     });
    //     return actionResponse;
    //   }
    // } else if (action === 'joinPool') {
    //   let enabled = false;
    //   // Modern dapp browsers...
    //   if (window.ethereum) {
    //     window.web3 = new Web3(window.ethereum);
    //     try {
    //       // Request account access if needed
    //       await window.ethereum.enable();
    //       enabled = true;
    //     } catch (error) {
    //       // User denied account access...
    //     }
    //   }
    //   // Legacy dapp browsers...
    //   else if (window.web3) {
    //     window.web3 = new Web3(window.web3.currentProvider);
    //     enabled = true;
    //   }
    //   // Non-dapp browsers...
    //   else {
    //     console.log(
    //       'Non-Ethereum browser detected. You should consider trying MetaMask!'
    //     );
    //   }
    //   if (enabled) {
    //     const web3Contract = new window.web3.eth.Contract(
    //       routerABI,
    //       contract.address
    //     );
    //     await new Promise(async resolve => {
    //       web3Contract.methods.joinPool
    //         .apply(null, data)
    //         .send({
    //           from: sender,
    //           gasPrice: await window.web3.eth.getGasPrice(),
    //         })
    //         .on('transactionHash', txId => {
    //           actionResponse.txResponse = { hash: txId } as TransactionResponse;
    //           resolve(txId);
    //         })
    //         .on('error', e => {
    //           actionResponse.error = e;
    //           resolve(null);
    //         });
    //     });
    //     return actionResponse;
    //   }
    // }

    let error = null;
    if (!overrides.gasLimit) {
      // Gas estimation
      const gasLimitNumber = await contract.estimate[action](
        ...data,
        overrides
      ).catch(e => {
        if (networkConnectors.getCurrentChainId() !== ChainId.MAINNET) {
          error = e;
          console.error(`${action}:`, e);
          return bnum(2e6);
        }
        console.error('Error - ' + action, e);
        return null;
      });
      if (gasLimitNumber) {
        const gasLimit = gasLimitNumber.toNumber();
        overrides.gasLimit = Math.floor(gasLimit * 1.2);
      }
      // ==========
    }

    actionResponse.txResponse = await contract[action](...data, overrides);
    if (error) {
      actionResponse.error = error;
    }
  } catch (e) {
    actionResponse.error = e;
  }

  postLog(actionResponse);
  return actionResponse;
};
