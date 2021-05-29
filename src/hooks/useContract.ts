import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { ChainId } from '@uniswap/sdk';
import { useStores } from '../contexts/storesContext';
import { AddressZero } from 'ethers/constants';
import { isAddress } from '../utils';
import { ERC20_ABI, ERC20_BYTES32_ABI } from '../constants/erc20';
import { abi as MULTICALL_ABI } from '../abi/Multicall.json';
import ENS_PUBLIC_RESOLVER_ABI from '../abi/ens-public-resolver.json';
import ENS_ABI from '../abi/ens-registrar.json';
import { MULTICALL_NETWORKS } from '../configs/addresses';
import { JsonRpcSigner } from 'ethers/providers';

type ContractResult = Contract | null;

// account is optional
function getContract(
  address: string,
  ABI: any,
  providerOrSigner: Web3Provider | JsonRpcSigner
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, providerOrSigner as any);
}

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): ContractResult {
  const {
    root: { providerStore },
  } = useStores();
  const { account, web3Provider } = providerStore.providerStatus;

  return useMemo(() => {
    if (!address || !ABI || !web3Provider) return null;
    try {
      const providerOrSigner = providerStore.getProviderOrSigner(
        web3Provider,
        withSignerIfPossible && account ? account : undefined
      );
      return getContract(address, ABI, providerOrSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [
    address,
    ABI,
    web3Provider,
    withSignerIfPossible,
    account,
    providerStore,
  ]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): ContractResult {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): ContractResult {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function useMulticallContract(): ContractResult {
  const {
    root: { providerStore },
  } = useStores();
  const { activeChainId: chainId } = providerStore.providerStatus;
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false
  );
  // return useContract(contractMetadataStore.getMultiAddress(), MULTICALL_ABI, false);
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): ContractResult {
  const {
    root: { providerStore },
  } = useStores();
  const { activeChainId: chainId } = providerStore.providerStatus;
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): ContractResult {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}
