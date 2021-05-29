import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { ChainId } from '../constants';
import { NetworkConnector } from './NetworkConnector';

const POLLING_INTERVAL = 12000;
export const RPC_URLS: { [chainId: number]: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_RPC_URL_56 as string,
  [ChainId.KOVAN]: process.env.REACT_APP_RPC_URL_97 as string,
  [ChainId.ETH_MAINNET]:
    'https://mainnet.infura.io/v3/50452ea5b92948f297bed85dec55f52e',
};

export const API_URLS: { [chainId: number]: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_API_URL_56 as string,
  [ChainId.KOVAN]: process.env.REACT_APP_API_URL_97 as string,
  [ChainId.ETH_MAINNET]: '',
};

export const VFARM_API_URLS: { [chainId: number]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.KOVAN]: '',
  [ChainId.ETH_MAINNET]: '',
};

export const SUBGRAPH_URLS: { [chainId: number]: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_SUBGRAPH_URL_56 as string,
  [ChainId.KOVAN]: process.env.REACT_APP_SUBGRAPH_URL_97 as string,
  [ChainId.ETH_MAINNET]: '',
};

export const NETWORK_CHAIN_ID: number = parseInt(
  process.env.REACT_APP_SUPPORTED_NETWORK_ID ?? '56'
);

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: RPC_URLS[ChainId.MAINNET] },
});

const supportedChainIds = [ChainId.MAINNET, ChainId.KOVAN];

// MetaMask
export const injected = new InjectedConnector({
  supportedChainIds: supportedChainIds,
});

// Trust Wallet
export const walletconnect = new WalletConnectConnector({
  rpc: { 56: RPC_URLS[ChainId.MAINNET] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export const bscConnector = new BscConnector({
  supportedChainIds: supportedChainIds,
});

export const CHAIN_NAMES = {
  MAINNET: 'mainnet',
  KOVAN: 'kovan',
  ETH_MAINNET: 'ethereum',
};

export const chainNameById = {
  [ChainId.MAINNET.toString()]: 'mainnet',
  [ChainId.KOVAN.toString()]: 'kovan',
  [ChainId.ETH_MAINNET.toString()]: 'ethereum',
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    mobile: true,
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  // COIN98_WALLET: {
  //   connector: injected,
  //   name: 'Coin98 Wallet',
  //   iconName: 'coin98wallet.png',
  //   description: 'Connect to Coin98 wallet.',
  //   href: null,
  //   color: '#E8831D',
  // },
  // COIN98_MOBILE_WALLET: {
  //   connector: walletconnect,
  //   name: 'Coin98 Mobile Wallet',
  //   iconName: 'coin98wallet.png',
  //   description: 'Connect to Coin98 mobile wallet.',
  //   href: null,
  //   color: '#E8831D',
  //   mobile: true,
  // },
  BSC_WALLET: {
    connector: bscConnector,
    name: 'Binance Chain Wallet',
    iconName: 'bsc-wallet.svg',
    description: 'Connect to Binance Chain Wallet.',
    href: null,
    color: '#E8831D',
    mobile: true,
  },
};
