import { ChainId } from '../constants';

export const CONTRACTS = {
  mainnet: {
    bFactory: '',
    exchangeProxy: '',
    uniRouterV2: '0xE5661A3e1c1350606705DD8Edeb8Bfc7d5934666', // ValueLiquidRouter
    ValueProvider: '0xE5661A3e1c1350606705DD8Edeb8Bfc7d5934666', // ValueLiquidRouter
    StakePoolController: '0x1b57B8D9b5e73cbC319bE0d7988E6f2979f4A90A',
    ValueLiquidFactory: '0x55388d337734DBdd1faCC7dbf9F2873efFae4545',
    weth: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    multicall: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
    MerkleDistributor: '',
    StableSwapFactory: '0x5392475A824D341571f73966EA6Ed0Dc601275Ba',
    StableSwapRouter: '0x1f8C7722C72e5A4E59A28071a6D26F2E7E7C9cda',
    ValueLiquidZap: '0x073a95BBfC6aF81962F68b3C4c2408a807b4413C',
  },
  kovan: {
    bFactory: '',
    exchangeProxy: '',
    uniRouterV2: '0x1Bea22fe0ac32BA91A03a5cf4471ffEf656Dbbf4', // ValueLiquidRouter
    ValueProvider: '0x1Bea22fe0ac32BA91A03a5cf4471ffEf656Dbbf4', // ValueLiquidRouter
    StakePoolController: '0x4E3B922D45AA741883e27bacC3C6c5Cb3768D969',
    ValueLiquidFactory: '0xE4A70022F94F143D9DD74D4Fc9DDBA9CA065D351',
    weth: '0xae13d989dac2f0debff460ac112a837c89baa7cd', // WBNB
    multicall: '0x7aa35985B617416F502afC69b25aB9dBF7FDd0a1',
    MerkleDistributor: '',
    StableSwapFactory: '0x390d32A673C1FA3BFab387B651d21Eb961c3e8fa',
    StableSwapRouter: '0x83C98ACb4f0C8aa45cBAbD878DF0E3FF955f0b0d',
    ValueLiquidZap: '0xa1bc7f31C7e09C3fAd1047Bb4080E0419da9eD16',
  },
};

export const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [ChainId.KOVAN]: '0x7aa35985B617416F502afC69b25aB9dBF7FDd0a1',
  [ChainId.ETH_MAINNET]: '',
};

export const chiGasToken = {
  address: '',
  name: 'Chi Gastoken by 1inch',
  symbol: 'CHI',
  precision: 2,
};

export const vUSDToken = {
  address: '',
  name: 'Value USD',
  symbol: 'vUSD',
  precision: 2,
};

export const vUSDContracts = {
  [ChainId.MAINNET]: {},
  [ChainId.KOVAN]: {},
};

export const BRIDGE_CONTRACTS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x2Dfb07Be34C5499A07E6873C249433C953D54480',
};

// etherscan.io
export const ERC20_BRIDGET_GATEWAY_CONTRACTS: { [chainId: number]: string } = {
  1: '0xfCFaB4ECDf2caF3c98145b6fcDac1B46760Ffcb6',
};
