import { useCallback } from 'react';
import { useStores } from '../contexts/storesContext';
import { getEtherscanLink } from '../utils';

export const useGetEtherscanLink = () => {
  const {
    root: { providerStore },
  } = useStores();
  const { activeChainId } = providerStore.providerStatus;
  return useCallback(
    (
      data: string,
      type: 'transaction' | 'token' | 'address' | 'block' = 'address'
    ) => {
      return getEtherscanLink(activeChainId, data, type);
    },
    [activeChainId]
  );
};
