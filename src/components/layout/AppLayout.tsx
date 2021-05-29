// import React, { useCallback, useState, useEffect, useRef } from 'react';
import React from 'react';
import styled from 'styled-components';
import { AppBar } from './styled';
import Header from '../Header';
import useToggle from '../../hooks/useToggle';
import { observer } from 'mobx-react';
// @ts-ignore
import MarketIcon from '../../assets/images/market-icon.svg'

const Wrapped = styled.div`
  margin-top: 52px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0;
  `};
  @media screen and (min-width: 767px) {
    display: flex;
  }
`;

const WrappedContent = styled.main`
  flex-grow: 1;
`;


export const MENU_ITEMS = [
  // { key: 'Home', to: '/', exact: true, icon: <Home size={20} /> },
  {
    key: 'Marketplace',
    to: '/marketplace',
    icon: MarketIcon
  }
];

const AppLayout = observer(({ children }: { children: React.ReactNode }) => {
  const [open] = useToggle(true);
  return (
    <>
      <AppBar
        open={open}
        position={'relative'}
        color={'transparent'}
        elevation={0}
      >
        <Header/>
      </AppBar>

      <Wrapped>
        <WrappedContent>{children}</WrappedContent>
      </Wrapped>
    </>
  );
});

export default AppLayout;
