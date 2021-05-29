import { appConfig } from './config-main';
import { ChainId } from '../constants';

export { appConfig };
export { VSTAKE_WHITELISTED_POOLS, VSTAKE_FAAS } from './vstake';

export const externalConfig = {
  docsUrl: 'https://docs.valuedefi.io',
  welcomeKit:
    'https://valuedefi.io/files/ValueDeFi_Welcome_Kit_for_FaaS_April_2021_v1.2.pdf',
  vSafeDoc: 'https://docs.valuedefi.io/products/vSafes',
};

interface DeflatingToken {
  address: string;
  deflatingFactor: number; // 0.03 = 3%
  symbol?: string;
}

export const DEFLATING_TOKENS: {
  [chainId in ChainId]?: DeflatingToken[];
} = {
  [ChainId.MAINNET]: require('./deflatingTokens/deflatingTokens.mainnet.json'),
  [ChainId.KOVAN]: require('./deflatingTokens/kovan.json'),
};
