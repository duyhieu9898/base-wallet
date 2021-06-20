import { chainNameById } from './connectors';


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
}

export const networkConnectors = new NetworkConnectorsClass();
