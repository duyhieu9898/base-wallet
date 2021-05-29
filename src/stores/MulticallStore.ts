import { action, observable } from 'mobx';
import RootStore from './Root';

export interface Call {
  address: string;
  callData: string;
}

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const LOWER_HEX_REGEX = /^0x[a-f0-9]*$/;

export function toCallKey(call: Call): string {
  if (!ADDRESS_REGEX.test(call.address)) {
    throw new Error(`Invalid address: ${call.address}`);
  }
  if (!LOWER_HEX_REGEX.test(call.callData)) {
    throw new Error(`Invalid hex: ${call.callData}`);
  }
  return `${call.address}-${call.callData}`;
}

export function parseCallKey(callKey: string): Call {
  const pcs = callKey.split('-');
  if (pcs.length !== 2) {
    throw new Error(`Invalid call key: ${callKey}`);
  }
  return {
    address: pcs[0],
    callData: pcs[1],
  };
}

export interface CallListeners {
  // on a per-chain basis
  [chainId: number]: {
    // stores for each call key the listeners' preferences
    [callKey: string]: {
      // stores how many listeners there are per each blocks per fetch preference
      [blocksPerFetch: number]: number;
    };
  };
}

export interface CallResults {
  [chainId: number]: {
    [callKey: string]: {
      data?: string | null;
      blockNumber?: number;
      fetchingBlockNumber?: number;
    };
  };
}

export interface ListenerOptions {
  // how often this data should be fetched, by default 1
  readonly blocksPerFetch?: number;
}

class MulticallStore {
  rootStore: RootStore;
  @observable callListeners?: CallListeners;
  @observable callResults: CallResults;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.callResults = {} as CallResults;
  }

  @action addMulticallListeners = ({
    calls,
    chainId,
    options: { blocksPerFetch = 1 } = {},
  }) => {
    const listeners: CallListeners = Object.assign(
      {},
      this.callListeners || {}
    );
    listeners[chainId] = listeners[chainId] ?? {};
    calls.forEach(call => {
      const callKey = toCallKey(call);
      listeners[chainId][callKey] = listeners[chainId][callKey] ?? {};
      listeners[chainId][callKey][blocksPerFetch] =
        (listeners[chainId][callKey][blocksPerFetch] ?? 0) + 1;
    });
    this.callListeners = Object.assign({}, this.callListeners || {}, listeners);
  };

  @action removeMulticallListeners = ({
    chainId,
    calls,
    options: { blocksPerFetch = 1 } = {},
  }) => {
    const listeners: CallListeners = Object.assign(
      {},
      this.callListeners || {}
    );

    if (!listeners[chainId]) return;
    calls.forEach(call => {
      const callKey = toCallKey(call);
      if (!listeners[chainId][callKey]) return;
      if (!listeners[chainId][callKey][blocksPerFetch]) return;

      if (listeners[chainId][callKey][blocksPerFetch] === 1) {
        delete listeners[chainId][callKey][blocksPerFetch];
      } else {
        listeners[chainId][callKey][blocksPerFetch]--;
      }
    });
    this.callListeners = Object.assign({}, this.callListeners || {}, listeners);
  };

  @action fetchingMulticallResults = ({
    chainId,
    fetchingBlockNumber,
    calls,
  }) => {
    const callResults = Object.assign({}, this.callResults[chainId] ?? {});
    calls.forEach(call => {
      const callKey = toCallKey(call);
      const current = callResults[callKey];
      if (!current) {
        callResults[callKey] = {
          fetchingBlockNumber,
        };
      } else {
        if ((current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber) return;
        callResults[callKey].fetchingBlockNumber = fetchingBlockNumber;
      }
    });
    this.callResults = Object.assign({}, this.callResults, {
      [chainId]: callResults,
    });
  };

  @action errorFetchingMulticallResults = ({
    fetchingBlockNumber,
    chainId,
    calls,
  }) => {
    const callResults = Object.assign({}, this.callResults[chainId] ?? {});
    calls.forEach(call => {
      const callKey = toCallKey(call);
      const current = callResults[callKey];
      if (!current) return; // only should be dispatched if we are already fetching
      if (current.fetchingBlockNumber === fetchingBlockNumber) {
        delete current.fetchingBlockNumber;
        current.data = null;
        current.blockNumber = fetchingBlockNumber;
      }
    });
    this.callResults = Object.assign({}, this.callResults, {
      [chainId]: callResults,
    });
  };

  @action updateMulticallResults = ({ chainId, results, blockNumber }) => {
    const callResults = Object.assign({}, this.callResults[chainId] ?? {});
    Object.keys(results).forEach(callKey => {
      const current = callResults[callKey];
      if ((current?.blockNumber ?? 0) > blockNumber) return;
      callResults[callKey] = {
        data: results[callKey],
        blockNumber,
      };
    });
    this.callResults = Object.assign({}, this.callResults, {
      [chainId]: callResults,
    });
  };
}

export default MulticallStore;
