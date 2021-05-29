import {
  chainNameById,
} from './connectors';

import registry from '../configs/registry.homestead.json';
import registryKovan from '../configs/registry.kovan.json';
import { CONTRACTS } from '../configs/addresses';

import { ChainId } from '../constants';

export interface PoolFilterTokens {
  id: string;
  symbol: string;
  address: string | string[];
}

const supportedChains = [ChainId.MAINNET, ChainId.KOVAN, ChainId.ETH_MAINNET];
const defaultChainId = Number(
  process.env.REACT_APP_SUPPORTED_NETWORK_ID || supportedChains[0]
);

export enum SUBGRAPH_TYPES {
  FAAS = 'faas',
}

class NetworkConnectorsClass {
  currentChainId: number;

  constructor() {
    this.currentChainId = defaultChainId;
  }

  getDefaultChainId(): number {
    return defaultChainId;
  }

  getCurrentChainId(): number {
    return this.currentChainId;
  }

  setCurrentChainId(value: number): void {
    this.currentChainId = Math.max(value, supportedChains[0]);
  }

  isChainIdSupported(chainId?: number): boolean {
    return supportedChains.indexOf(chainId ?? this.currentChainId) >= 0;
  }
  getSupportedChainName(chainId = undefined): string {
    return chainNameById[chainId ?? this.currentChainId];
  }

  getContracts(chainId?: ChainId) {
    return CONTRACTS[this.getSupportedChainName(chainId)] || {};
  }

  getContractConfig() {
    return {
      collectedToken: '', // VALUE
    };
  }

  getAssets() {
    const chainName = this.getSupportedChainName();
    let tokens: any = {};
    let stableTokens: any = {};
    let untrusted: string[] = [];
    switch (chainName) {
      case 'mainnet': {
        tokens = registry.tokens;
        // stableTokens = STABLE_TOKENS[ChainId.MAINNET];
        untrusted = registry.untrusted;
        break;
      }
      case 'kovan': {
        tokens = registryKovan.tokens;
        // stableTokens = STABLE_TOKENS[ChainId.KOVAN];
        untrusted = registryKovan.untrusted;
        break;
      }
      default: {
        break;
      }
    }
    if (Object.keys(stableTokens).length > 0) {
      Object.entries(stableTokens).forEach(([addr, info]: [string, any]) => {
        tokens[addr] = {
          ...info,
          stable: true,
        };
      });
    }
    return { tokens, untrusted };
  }
}

export const networkConnectors = new NetworkConnectorsClass();
