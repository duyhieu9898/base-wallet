import { networkConnectors } from '../provider/networkConnectors';
import { isAddressEqual } from './helpers';
import { EtherKey, TokenMetadata } from '../stores/Token';
import { checkIsMasterFaaSPool, PoolVersion } from './poolVersion';
import { ChainId } from '../constants';

export function wrappedCurrency(
  token: TokenMetadata,
  chainId: ChainId
): TokenMetadata {
  const { weth } = networkConnectors.getContracts(chainId);
  if (isAddressEqual(token?.address, EtherKey)) {
    return Object.assign({}, token, {
      address: weth,
      symbol: 'WBNB',
    });
  }
  return token;
}

export function unwrappedToken(
  token: any,
  version: PoolVersion = undefined,
  chainId
): any {
  const { weth } = networkConnectors.getContracts(chainId);
  if (
    (!version || checkIsMasterFaaSPool(version)) &&
    isAddressEqual(token?.address, weth)
  ) {
    return Object.assign({}, token, {
      address: EtherKey,
      symbol: 'BNB',
    });
  }
  return token;
}

export function unwrappedSymbol(name: string): string {
  return name?.toUpperCase() === 'WBNB' ? 'BNB' : name;
}
