import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    borderTop: '1px solid #373E50',
    margin: '60px 0 0 0',
    [theme.breakpoints.up('sm')]: {
      padding: '4rem 0 0rem',
    },
  }
}));


const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      footer
    </div>
  );
};

export default Footer;
