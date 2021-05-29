import { BigNumber } from 'bignumber.js';
import { BLOCKED_PRICE_IMPACT_NON_EXPERT } from '../constants';
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
} from '../constants';
import { SwapMethods } from '../stores/SwapForm';
import { bnum, isAddressEqual } from './helpers';

const minimumAmountOut = function(trade, slippageTolerance) {
  if (trade.swapMethod === SwapMethods.EXACT_OUT) {
    return new BigNumber(trade.outputAmount);
  } else {
    return new BigNumber(100)
      .minus(slippageTolerance)
      .multipliedBy(trade.outputAmount)
      .div(100);
  }
};

const maximumAmountIn = function(trade, slippageTolerance) {
  if (trade.swapMethod === SwapMethods.EXACT_IN) {
    return new BigNumber(trade.inputAmount);
  } else {
    return new BigNumber(100)
      .plus(slippageTolerance)
      .multipliedBy(trade.inputAmount)
      .div(100);
  }
};

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: any | undefined,
  allowedSlippage: number
): { [field in SwapMethods]?: BigNumber } {
  return {
    [SwapMethods.EXACT_IN]: maximumAmountIn(trade, allowedSlippage),
    [SwapMethods.EXACT_OUT]: minimumAmountOut(trade, allowedSlippage),
  };
}

export function warningSeverity(
  priceImpact: BigNumber | number | undefined
): 0 | 1 | 2 | 3 | 4 {
  const value =
    typeof priceImpact === 'number' ? new BigNumber(priceImpact) : priceImpact;
  if (!value?.lt(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4;
  if (!value?.lt(ALLOWED_PRICE_IMPACT_HIGH)) return 3;
  if (!value?.lt(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2;
  if (!value?.lt(ALLOWED_PRICE_IMPACT_LOW)) return 1;
  return 0;
}

export function calcSpotPriceDecimals(
  pool: any,
  tokenInAddress: string,
  tokenOutAddress: string
): BigNumber {
  try {
    const { tokens } = pool;
    const tokenIn =
      tokens.find(t => isAddressEqual(t?.address, tokenInAddress)) || {};
    const tokenOut =
      tokens.find(t => isAddressEqual(t?.address, tokenOutAddress)) || {};
    const inRatio = bnum(tokenIn.balance).div(tokenIn.denormWeight);
    const outRatio = bnum(tokenOut.balance).div(tokenOut.denormWeight);
    if (outRatio.isEqualTo(bnum(0))) {
      return bnum(0);
    } else {
      const swapFee = bnum(pool.swapFee).div(1e18);
      return bnum(bnum(inRatio).div(outRatio)).div(bnum(1).minus(swapFee));
    }
  } catch (e) {
    console.error('[calcSpotPrice]', e);
    return bnum(0);
  }
}
