import { getAddress } from '@ethersproject/address';
import { ChainId } from '../constants';
import { BigNumber } from 'bignumber.js';
import { bnum, isAddressEqual } from './helpers';
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

/**
 * gets the amoutn difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export const get2DayPercentChange = (
  valueNow,
  value24HoursAgo,
  value48HoursAgo = '0'
) => {
  // get volume info for both 24 hour periods
  let currentChange: number =
    parseFloat(valueNow) - parseFloat(value24HoursAgo);
  let previousChange: number =
    parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo);

  const adjustedPercentChange =
    ((currentChange - previousChange) / previousChange) * 100;

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0];
  }
  return [currentChange, adjustedPercentChange];
};

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
const urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';

/**
 *
 * @public
 */
export function nanoid(size: number = 21) {
  let id = ''; // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size;
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id;
}

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

export function checkIsVUsdLegacy(tokenAddress: string): boolean {
  return isAddressEqual(
    tokenAddress,
    '0x1B8E12F839BD4e73A47adDF76cF7F0097d74c14C'
  );
}

export function formatUnixTime(unix) {
  const milliseconds = unix * 1000;
  const dateObject = new Date(milliseconds);
  let dateStr = dateObject.toString();
  const endIndex = dateStr.indexOf('(');
  dateStr = dateStr.substr(0, endIndex);
  return dateStr;
}

export function getEstTimeByBlock(inputBlock, currentBlock) {
  if (!inputBlock || !currentBlock || inputBlock <= currentBlock) return '';

  const timeStamp =
    (inputBlock - currentBlock) * 3 + Math.ceil(Date.now() / 1000);
  return formatUnixTime(timeStamp);
}

export function secondsToLevels(s: number): string {
  const d = Math.floor(s / (3600 * 24));
  s -= d * 3600 * 24;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  const tmp = [];
  d && tmp.push(d + 'd');
  (h || m || s) && tmp.push(h + 'h');
  (m || s) && tmp.push(m + 'm');
  s && tmp.push(s + 's');
  return tmp.join(' ');
}

export const filterPools = (
  checksum,
  tokensIn,
  tokensContains,
  initialPools
) => {
  if (!checksum && !tokensIn && !tokensContains) {
    return initialPools;
  }

  if (checksum) {
    return initialPools.filter(p =>
      isAddressEqual(checksum, p.contractAddress)
    );
  }
  // tokensContains
  if (Array.isArray(tokensContains) && tokensContains.length) {
    return initialPools.filter(p => {
      return !p.tokens.some(
        t => tokensContains.indexOf(t.symbol?.toUpperCase()) === -1
      );
    });
  }

  // tokensIn
  if (Array.isArray(tokensIn) && tokensIn.length) {
    return initialPools.filter(p => {
      return (
        p.tokens.some(t => {
          return tokensIn.some(
            keyword => t.symbol.toUpperCase().indexOf(keyword) >= 0
          );
        }) ||
        tokensIn.some(
          keyword => p.stakeToken.name.toUpperCase().indexOf(keyword) >= 0
        )
      );
    });
  }
};

export const uniqueArray = (arrArg: any) => {
  return arrArg.filter((elem: any, pos: number, arr: Array<any>) => {
    return arr.indexOf(elem) === pos;
  });
};
