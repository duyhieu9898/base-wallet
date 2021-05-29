export const colors = {
  white: '#fff',
  black: '#000',
  darkBlue: '#2c3b57',
  blue: '#2F80ED',
  gray: '#e1e1e1',
  lightGray: '#737373',
  lightBlack: '#6a6a6a',
  darkBlack: '#141414',
  green: '#1abc9c',
  red: '#ed4337',
  orange: 'orange',
  pink: '#DC6BE5',
  compoundGreen: '#00d395',
  tomato: '#e56b73',
  purple: '#935dff',

  text: '#fafafa',
  subTextColor: '#ABB2C8',
  placeholder: '#7e8398',
  lightBlue: '#2F80ED',
  topaz: '#0b8f92',
  error: '#e56b73',
  darkGray: '#a7a7a7', // "rgba(43,57,84,.5)",
  borderBlue: 'rgba(25, 101, 233, 0.5)',

  backgroundColor: '#181C27',
  cardColor: '#1e2139',
  headerColor: '#ffffff',
  borderColor: '#3a3f50',
  tooltipBg: '#343d58',

  defaultColor: '#43D2FF',
  primaryColor: '#ffd599',
  secondaryColor: '#17FF90',
  thirdColor: '#f7931a',
  innerColor: '#151923',
};

export const commonStyles = {
  hightLight: {
    color: '#F7931A',
  },
  meta: {
    opacity: '0.7',
  },
};

export const valueStyles = {
  defaultRadius: '6px',
};

export const elementStyles = {
  defaultBorder: {
    border: '1px solid ' + colors.borderColor,
    borderRadius: valueStyles.defaultRadius,
  },
  wrappedBox: {
    border: '1px solid ' + colors.borderColor,
    borderRadius: valueStyles.defaultRadius,
    // boxShadow: '0px 2px 4px 2px #151923',
    padding: '12px',
  },
  wrappedNewBox: {
    borderRadius: valueStyles.defaultRadius,
    // boxShadow: '0px 2px 4px 2px #151923',
    padding: '12px',
  },
};
