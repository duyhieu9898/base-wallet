import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '../../theme/home';

const useStyles = makeStyles(theme => ({
  btn: {
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    fontFamily: 'GoogleSans, Open Sans, Arial, sans-serif',
    fontSize: '16px',
    padding: '10px 15px',
    cursor: 'pointer',

    '&.primary': {
      background: colors.secondaryColor,
      color: colors.innerColor,
      border: '1px solid #373E50',
    },
    '&.primary:hover': {
      background: '#74FFBC',
    },
    '&.secondary': {
      background: 'transparent',
      border: '1px solid #373E50',
      color: '#43D2FF',
    },
    '&.secondary:hover': {
      borderColor: '#43D2FF',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '18px',
    },
  },
}));

function Button({
  children,
  type,
  onClick,
  className,
}: {
  children: React.ReactNode;
  type?: string;
  className?: string;
  onClick?: any;
}) {
  const classes = useStyles();

  return (
    <button className={`${classes.btn} ${type} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
