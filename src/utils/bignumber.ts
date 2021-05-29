import { BigNumber } from 'bignumber.js';
import { BigNumber as EtherBigNumber } from '@ethersproject/bignumber';

BigNumber.config({
  EXPONENTIAL_AT: [-100, 100],
  ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN,
  DECIMAL_PLACES: 18,
});

const toEtherBigNumber = (value: any) => {
  return EtherBigNumber.from(value);
};

export { BigNumber, EtherBigNumber, toEtherBigNumber };
