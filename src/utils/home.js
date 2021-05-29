// @ts-ignore
export function numberFormat(
  number,
  decimals = null,
  trailingZeros = false,
  thousandsSep,
  decPoint
) {
  if (typeof number === 'undefined') return;
  // Strip all characters but numerical ones.
  const numerical = `${number}`.replace(/[^0-9+\-Ee.]/g, '');
  const n = !isFinite(+numerical) ? 0 : +numerical;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = typeof thousandsSep === 'undefined' ? '' : thousandsSep;
  const dec = typeof decPoint === 'undefined' ? '.' : decPoint;
  let s = '';
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

export function numFormat(num, decimals = 2) {
  // @ts-ignore
  return numberFormat(num, decimals, false, ',');
}

export function formatAddress(address) {
  return address.slice(0, 8) + '...' + address.slice(-4);
}

export function formatBalanceTruncated(balance, _decimals = 6) {
  if (!balance) {
    return '0.00';
  }
  let value;
  if (typeof balance === 'string') {
    value = parseFloat(balance);
  } else if (typeof balance === 'number') {
    value = balance;
  }
  if (value > 0 && value <= 1e-6) {
    return '<0.00001';
  }
  const integralPart = Math.floor(value).toString();
  const decimals = Math.max(_decimals - integralPart.length, 1);
  return numberFormat(value, decimals, false, ',');
}
