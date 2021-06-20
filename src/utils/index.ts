import { getAddress } from '@ethersproject/address';
import { ChainId } from '../constants';
import { BigNumber } from 'bignumber.js';
import { bnum } from './helpers';
import { EtherBigNumber, toEtherBigNumber } from './bignumber';
// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value?.toLowerCase());
  } catch {
    return false;
  }
}

export function checkStringIsAddress(_str: string): string | false {
  const str = _str?.toString();
  if (!str || !/^0x/.test(str) || str.length !== 42) {
    return false;
  }
  return isAddress(str.toString());
}


// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  if (!address) {
    return '';
  }
  const parsed = isAddress(address);
  if (!parsed) {
    // throw Error(`Invalid 'address' parameter '${address}'.`);
    return '';
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  56: '',
  97: 'testnet.',
  1: 'https://etherscan.io',
};

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block' = 'address'
): string {
  const prefix =
    chainId === ChainId.ETH_MAINNET
      ? ETHERSCAN_PREFIXES[chainId]
      : `https://${ETHERSCAN_PREFIXES[chainId] || ''}bscscan.com`;

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'block': {
      return `${prefix}/block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}


export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function currencyId(currency: any): string {
  if (currency) {
    if (currency.address && currency.address.toLowerCase() === 'ether') {
      return 'ETH';
    }
    return currency.address;
  }
  throw new Error('invalid currency');
}

export async function splitQuery(
  query,
  localClient,
  vars,
  list,
  skipCount = 100
) {
  let fetchedData = {};
  let allFound = false;
  let skip = 0;

  while (!allFound) {
    let end = list.length;
    if (skip + skipCount < list.length) {
      end = skip + skipCount;
    }
    let sliced = list.slice(skip, end);
    let result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: 'cache-first',
    });
    fetchedData = {
      ...fetchedData,
      ...result.data,
    };
    if (
      Object.keys(result.data).length < skipCount ||
      skip + skipCount > list.length
    ) {
      allFound = true;
    } else {
      skip += skipCount;
    }
  }

  return fetchedData;
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */


// Borrowed from https://github.com/ai/nanoid/blob/3.0.2/non-secure/index.js
// This alphabet uses `A-Za-z0-9_-` symbols. A genetic algorithm helped
// optimize the gzip compression for this alphabet.


export function calculateSlippageAmount(
  _value: string | number | BigNumber,
  slippage: number
): [BigNumber, BigNumber] {
  // slippage: 0.005 = 0.5%
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  const value = bnum(_value);
  return [
    value.multipliedBy(
      bnum(1)
        .minus(slippage)
        .div(1)
    ),
    value.multipliedBy(
      bnum(1)
        .plus(slippage)
        .div(1)
    ),
  ];
}

// add 10%
export function calculateGasMargin(
  _value: string | EtherBigNumber
): EtherBigNumber {
  let value = _value;
  if (typeof value === 'string') {
    value = toEtherBigNumber(value);
  }
  return value
    .mul(EtherBigNumber.from(10000).add(EtherBigNumber.from(1000)))
    .div(EtherBigNumber.from(10000));
}


export function formatUnixTime(unix) {
  const milliseconds = unix * 1000;
  const dateObject = new Date(milliseconds);
  let dateStr = dateObject.toString();
  const endIndex = dateStr.indexOf('(');
  dateStr = dateStr.substr(0, endIndex);
  return dateStr;
}


