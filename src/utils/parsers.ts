import { denormalizeBalance, normalizeBalance } from './helpers';
import { Pool, PoolPairData } from '../modules/valueliquid-sor/src/types';
import { bnum, scale } from '../modules/valueliquid-sor/src/bmath';

export function parseSingleSubgraphPoolData(pool: any): any {
  if (!pool) {
    return {};
  }
  // const tokens = Array.isArray(pool.tokens)
  //   ? pool.tokens.map(t => {
  //       return {
  //         ...t,
  //         balance: denormalizeBalance(t.balance, t.decimals),
  //         denormWeight: denormalizeBalance(t.denormWeight, 18),
  //       };
  //     })
  //   : [];
  return {
    ...pool,
    swapFee: denormalizeBalance(pool.swapFee, 18),
    // totalWeight: denormalizeBalance(pool.totalWeight, 18),
    // tokens,
  };
}

export function parsePoolsListData(pools: any[]): any[] {
  if (!Array.isArray(pools) || !pools.length) {
    return [];
  }
  return pools.map(parseSingleSubgraphPoolData);
}

export function parseSingleOnChainPoolsData(pool: any): any {
  if (!pool) {
    return {};
  }
  const tokens = Array.isArray(pool.tokens)
    ? pool.tokens.map(t => {
        return {
          ...t,
          balance: normalizeBalance(t.balance, t.decimals),
          denormWeight: normalizeBalance(t.denormWeight, 18),
        };
      })
    : [];
  return {
    ...pool,
    totalShares: normalizeBalance(pool.totalShares, 18),
    totalWeight: normalizeBalance(pool.totalWeight, 18),
    tokens,
  };
}

export function parseOnChainPoolsData(pools: any[]): any[] {
  if (!Array.isArray(pools) || !pools.length) {
    return [];
  }
  return pools.map(parseSingleOnChainPoolsData);
}

export const parsePoolPairDataV2 = (
  p: Pool,
  tokenIn: string,
  tokenOut: string
): PoolPairData => {
  const tI = p.tokens.find(
    t => t.address?.toLowerCase() === tokenIn?.toLowerCase()
  );
  const tO = p.tokens.find(
    t => t.address?.toLowerCase() === tokenOut?.toLowerCase()
  );

  return {
    id: p.id,
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    balanceIn: denormalizeBalance(tI.balance, tI.decimals),
    balanceOut: denormalizeBalance(tO.balance, tO.decimals),
    weightIn: scale(bnum(tI.denormWeight).div(bnum(p.totalWeight)), 18),
    weightOut: scale(bnum(tO.denormWeight).div(bnum(p.totalWeight)), 18),
    swapFee: bnum(p.swapFee), // wei
    collectedFee: denormalizeBalance(p.collectedFee, 18),
    collectedToken: p.collectedToken,
    version: p.version,
  };
};
