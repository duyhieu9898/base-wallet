// Libraries
import jazzicon from 'jazzicon';
import { ethers, utils } from 'ethers';
import { BigNumber } from '../utils/bignumber';
import { SUPPORTED_THEMES } from '../theme';
import Fingerprint2 from 'fingerprintjs2';
import { v4 as uuidv4 } from 'uuid';
// Utils
export const MAX_GAS = utils.bigNumberify('0xffffffff');
export const MAX_UINT = utils.bigNumberify(ethers.constants.MaxUint256);
export const MAX_UINT_STRING =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

export const formatDate = timestamp => {
  const date = new Date(timestamp * 1000);
  return `${date.toDateString()} ${addZero(date.getHours())}:${addZero(
    date.getMinutes()
  )}:${addZero(date.getSeconds())}`;
};

export const addZero = value => {
  return value > 9 ? value : `0${value}`;
};

export function bnum(
  val: string | number | utils.BigNumber | BigNumber
): BigNumber {
  return !val ? new BigNumber(0) : new BigNumber(val.toString());
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
  const scalePow = new BigNumber(decimalPlaces?.toString() ?? 0);
  const scaleMul = new BigNumber(10).pow(scalePow);
  return input.times(scaleMul);
}

export function fromWei(val: string | utils.BigNumber | BigNumber): string {
  return utils.formatEther(val.toString());
}

export function toWei(val: string | utils.BigNumber | BigNumber): BigNumber {
  return scale(bnum(val.toString()), 18).integerValue();
}

export function denormalizeBalance(
  amount: number | string | BigNumber,
  tokenDecimals: number
): BigNumber {
  return scale(bnum(amount), tokenDecimals).decimalPlaces(0);
}

export function normalizeBalance(
  amount: number | string | BigNumber,
  tokenDecimals: number
): BigNumber {
  return scale(bnum(amount), -tokenDecimals).decimalPlaces(tokenDecimals);
}

export function toPercent(value: number | string | BigNumber): number {
  return bnum(value || 0)
    .times(100)
    .toNumber();
}

export function setPropertyToMaxUintIfEmpty(value?): string {
  if (!value || value === 0 || value === '') {
    value = MAX_UINT.toString();
  }
  return value;
}

export function setPropertyToZeroIfEmpty(value?): string {
  if (!value || value === '') {
    value = '0';
  }
  return value;
}

export function toAddressStub(address) {
  const start = address.slice(0, 5);
  const end = address.slice(-3);

  return `${start}...${end}`;
}

export function isEmpty(str: string): boolean {
  return !str || 0 === str.length;
}

export function roundValue(value, decimals = 4): string {
  const decimalPoint = value.indexOf('.');
  if (decimalPoint === -1) {
    return value;
  }
  return value.slice(0, decimalPoint + decimals + 1);
}

export function str(value: any): string {
  return value.toString();
}

export function shortenTransactionHash(hash, digits = 4) {
  return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`;
}

export function fromFeeToPercentage(value) {
  const etherValue = bnum(fromWei(value));
  return etherValue.times(100);
}

export function formatPctString(value: BigNumber): string {
  if (value.lte(0.01) && value.gt(0)) {
    return '<0.01%';
  }
  return `${value.toFormat(2, BigNumber.ROUND_HALF_EVEN)}%`;
}

export function getQueryParam(windowLocation, name) {
  var q = windowLocation.search.match(new RegExp('[?&]' + name + '=([^&#?]*)'));
  return q && q[1];
}

export function checkSupportedTheme(themeName) {
  if (themeName && themeName.toUpperCase() in SUPPORTED_THEMES) {
    return themeName.toUpperCase();
  }
  return null;
}

export function copyToClipboard(str: any) {
  let el: any = str;
  if (typeof str === 'string') {
    el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.left = '-9999px';
    el.style.zIndex = '-1';
    document.body.appendChild(el);
  }

  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    // save current contentEditable/readOnly status
    const editable = el.contentEditable;
    const readOnly = el.readOnly;

    // convert to editable with readonly to stop iOS keyboard opening
    el.contentEditable = true;
    el.readOnly = true;

    // create a selectable range
    const range = document.createRange();
    range.selectNodeContents(el);

    // select the range
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    el.setSelectionRange(0, 999999);

    // restore contentEditable/readOnly to original state
    el.contentEditable = editable;
    el.readOnly = readOnly;
  } else {
    el.focus();
    el.select();
  }

  document.execCommand('copy');
  if (typeof str === 'string') {
    document.body.removeChild(el);
  }
  // clear text selection
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges();
    }
    // @ts-ignore
  } else if (document.selection) {
    // IE?
    // @ts-ignore
    document.selection.empty();
  }
}

export const generateIcon = address => {
  return jazzicon(28, address.substr(0, 10));
};

export const normalizePriceValuesInput = (
  inputValue: BigNumber,
  inputDecimals: number,
  outputValue: BigNumber,
  outputDecimals: number
): {
  normalizedInput: BigNumber;
  normalizedOutput: BigNumber;
} => {
  const multiplier = scale(bnum(1), inputDecimals).div(inputValue);
  return {
    normalizedInput: bnum(1),
    normalizedOutput: scale(outputValue.times(multiplier), -outputDecimals),
  };
};

export const normalizePriceValuesOutput = (
  inputValue: BigNumber,
  inputDecimals: number,
  outputValue: BigNumber,
  outputDecimals: number
): {
  normalizedInput: BigNumber;
  normalizedOutput: BigNumber;
} => {
  const multiplier = scale(bnum(1), outputDecimals).div(outputValue);
  return {
    normalizedInput: bnum(1),
    normalizedOutput: scale(inputValue.times(multiplier), -inputDecimals),
  };
};

interface NumberFormatOptions {
  thousandsSep?: string;
  decimals?: number;
}

export const formatBalanceTruncated = (
  balance?: number | string | BigNumber,
  options: NumberFormatOptions = {}
): string => {
  if (!balance) {
    return '0.00';
  }
  let value: string;
  if (typeof balance === 'string') {
    value = balance;
  } else if (typeof balance === 'number') {
    value = balance.toString();
  } else {
    value = balance.toFixed();
  }
  if (bnum(value).gt(0) && bnum(value).lte(1e-6)) {
    return '<0.00001';
  }
  const integralPart = Math.floor(parseFloat(value)).toString();
  let _decimals = options.decimals ?? Math.max(6 - integralPart.length, 1);
  return numberFormat(value, _decimals, options.thousandsSep || '');
};

export const formatBalanceWithCommas = (
  balance?: number | string | BigNumber,
  options: NumberFormatOptions = {}
) => {
  return formatBalanceTruncated(balance, { ...options, thousandsSep: ',' });
};

export const toBalanceFormatted = (
  weiBalance: number | string | BigNumber,
  decimals: number
): string => {
  let balance: BigNumber;
  try {
    balance = BigNumber.isBigNumber(weiBalance)
      ? weiBalance
      : bnum(weiBalance || 0);
  } catch (e) {
    balance = bnum(weiBalance || 0);
  }
  return scale(balance, -decimals)
    .decimalPlaces(decimals, BigNumber.ROUND_DOWN)
    .toFixed();
};

export function abbreviateNumber(
  number,
  min = 1e3,
  digits = 2,
  options: NumberFormatOptions = { thousandsSep: ',' }
): string {
  if (!number || isNaN(number)) return number;
  const num = +number;
  if (num < min) {
    return formatBalanceTruncated(num, options);
  }

  const units = ['K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];
  let decimal = 0;

  for (let i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);

    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i];
    }
  }

  return `${num}`;
}

export const padToDecimalPlaces = (
  value: string,
  minDecimals: number
): string => {
  const split = value.split('.');

  if (!split[1]) {
    return value + '.00';
  } else if (split[1].length > 1) {
    return value;
  } else {
    return value + '0';
  }
};

export const getGasPriceFromETHGasStation = () => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject('Request timed out!');
    }, 3000);

    fetch('https://ethgasstation.info/json/ethgasAPI.json').then(
      stream => {
        stream.json().then(price => {
          clearTimeout(timeout);
          resolve(price);
        });
      },
      e => {
        clearTimeout(timeout);
        reject(e);
      }
    );
  });
};

// export const formatPoolData = (pools: Pool[]): Pool[] => {
//     const result: Pool[] = [];
//     pools.forEach(pool => {
//         result.push({
//             id: pool.id,
//             balanceIn: new BigNumber(fromWei(pool.balanceIn)),
//             balanceOut: new BigNumber(fromWei(pool.balanceOut)),
//             weightIn: new BigNumber(fromWei(pool.weightIn)),
//             weightOut: new BigNumber(fromWei(pool.weightOut)),
//             swapFee: new BigNumber(fromWei(pool.swapFee)),
//         });
//     });
//     return result;
// };

export function numberFormat(
  number,
  decimals = null,
  thousandsSep = ',',
  decPoint = '.',
  trailingZeros = false
) {
  if (typeof number === 'undefined') return;
  // Strip all characters but numerical ones.
  const numerical = `${number}`.replace(/[^0-9+\-Ee.]/g, '');
  const n = !isFinite(+numerical) ? 0 : +numerical;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep;
  const dec = typeof decPoint === 'undefined' ? '.' : decPoint;
  let s = [];
  const toFixedFix = function(n, prec) {
    const k = Math.pow(10, prec);
    return `${Math.round(n * k) / k}`;
  };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (decimals === null
    ? `${n}`
    : prec
    ? toFixedFix(n, prec)
    : `${Math.round(n)}`
  ).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    if (trailingZeros) {
      // 1.123 with decimals = 5 => 1.12300
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
  }
  return s[1] ? s.join(dec) : s[0];
}

export function amountFormat(num, decimals = 2) {
  const _num = bnum(num);
  let d = decimals;
  if (_num.gt(0)) {
    if (_num.lt(1)) {
      d = 6;
    } else if (_num.gte(1e5)) {
      d = 0;
    }
  }
  return numberFormat(num, d);
}

export function addressEquals(addr1: string, addr2: string): boolean {
  return addr1 && addr2 ? addr1.toLowerCase() === addr2.toLowerCase() : false;
}

export const isTxRejected = error => {
  if (!error) {
    return false;
  }
  return error.code === 4001 || error.code === -32603;
};

export const isTxReverted = error => {
  if (!error) {
    return false;
  }
  return error.code === -32016;
};


export function arraysEqual(array1: any[], array2: any[]): boolean {
  const array2Sorted = array2.slice().sort();
  return (
    array1.length === array2.length &&
    array1
      .slice()
      .sort()
      .every(function(value, index) {
        return value === array2Sorted[index];
      })
  );
}

export function truncateAddress(str: string): string {
  return str ? str.substr(0, 6) + '...' + str.substr(-4) : str;
}

export function serializeJSON(json = {}): string {
  if (Object.keys(json).length === 0) {
    return '';
  } else {
    let parameters = Object.keys(json).filter(function(key) {
      return json[key] !== null;
    });
    return parameters
      .map(function(keyName) {
        if (json[keyName] !== null) {
          return (
            encodeURIComponent(keyName) +
            '=' +
            encodeURIComponent(json[keyName])
          );
        }
        return '';
      })
      .join('&');
  }
}

export function isArrayEqual(a1, a2): boolean {
  let a = [],
    diff = [];
  for (let i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }
  for (let i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    } else {
      a[a2[i]] = true;
    }
  }
  for (let k in a) {
    diff.push(k);
  }
  return diff.length === 0;
}

export function isAddressEqual(a1, a2): boolean {
  return `${a1}`.toLowerCase() === `${a2}`.toLowerCase();
}

export function setCookie(cname, cvalue, extimes, timeType = 'days') {
  const d = new Date();
  if (timeType === 'days') {
    d.setTime(d.getTime() + extimes * 24 * 60 * 60 * 1000);
  } else if (timeType === 'hours') {
    d.setTime(d.getTime() + extimes * 60 * 60 * 1000);
  } else if (timeType === 'minutes') {
    d.setTime(d.getTime() + extimes * 60 * 1000);
  } else if (timeType === 'seconds') {
    d.setTime(d.getTime() + extimes * 1000);
  }
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export function getCookie(cname) {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function checkCookie(cname) {
  const cookieName = getCookie(cname);
  return cookieName && cookieName !== '';
}

export function deleteCookie(cname) {
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function isDevEnv() {
  return (
    process.env.REACT_APP_ENV === 'local' ||
    process.env.REACT_APP_ENV === 'development'
  );
}

export function estRewardPerDay(
  rewardPerBlock: number,
  rewardSymbol: string,
  isShowLabel: boolean = true
): string {
  if (!rewardSymbol || !rewardPerBlock) return '';

  const label = isShowLabel ? 'Est reward per day:' : '';

  const blockPerDay = (60 * 24 * 60) / 3;
  return `${label} ${numberFormat(
    blockPerDay * rewardPerBlock,
    2,
    ','
  )} ${rewardSymbol}/day`;
}

export function getUniqueClientId() {
  if (typeof window === 'undefined') {
    return null;
  }
  // globally-unique identifiers
  let guid = window.localStorage.getItem('clientId');
  if (guid) {
    return guid;
  }
  guid = uuidv4();
  window.localStorage.setItem('clientId', guid);
  return guid;
}

export function getFingerPrintHash(): Promise<string> {
  try {
    return new Promise(resolve => {
      Fingerprint2.get({}, function(components) {
        const values = components.map(function(component) {
          return component.value;
        });
        const murmur = Fingerprint2.x64hash128(values.join(''), 31);
        resolve(murmur);
      });
    });
  } catch (e) {
    console.error('Error: getFingerPrintHash: ', e);
    return Promise.reject();
  }
}
