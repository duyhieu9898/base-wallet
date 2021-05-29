import { nodes } from './getRpcUrl';
import { ChainId } from '../constants';

export const setupNetwork = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const provider = window.ethereum;
  if (provider) {
    // const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);
    const chainId = parseInt(ChainId.MAINNET?.toString(), 10);
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'Binance Smart Chain',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: ['https://bscscan.com/'],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

export default null;
