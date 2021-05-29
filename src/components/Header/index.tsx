import React from 'react';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react';
import styled, { css } from 'styled-components';
import Wallet from '../Wallet';
import { RowBetween } from '../Row';
// @ts-ignore
import { ExternalText } from '../Common';
import Menu from './Menu';
import { themeProperties } from '../../theme';
import { MENU_ITEMS } from '../layout/AppLayout';


const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: relative;
    margin-bottom: 1rem;
  `};
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${themeProperties.halfPaddingCard} 0 ${themeProperties.paddingCard};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin-bottom: 1rem;
  `}
`;

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 8px;
  `}
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    justify-content: center;
    flex-direction: column-reverse;
  `};
`;

const SideNav = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

const urlStyles = css`
  display: flex;
  flex-flow: row nowrap;
  text-decoration: none;
  font-weight: 500;
  padding: 4px 16px;
  margin: 0 6px;
  position: relative;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

const BasicNavLink = styled(NavLink)`
  ${urlStyles};
  &.active {
    height: 52px;
    background: #242735
  }
`;


const BasicUrl = styled.a<{ external?: boolean }>`
  ${urlStyles};
`;

const Header = observer(({ toggles }: { toggles?: React.ReactNode }) => {
  return (
    <HeaderFrame>
      <RowBetween
        align={'center'}
        flexWrap={'wrap'}
        style={{ position: 'relative' }}
      >
        <HeaderLeft>
          {toggles ?? null}
          <SideNav>
            {MENU_ITEMS.map((menu: any) => {
              const attrs: any = {
                key: menu.key,
              };
              if (menu.href) {
                attrs.href = menu.href;
                attrs.target = '_blank';
              } else {
                attrs.to = menu.to;
                attrs.exact = menu.exact;
              }
              if (menu.href) {
                return (
                  <BasicUrl external {...attrs}>
                    <ExternalText>{menu.key}</ExternalText>
                  </BasicUrl>
                );
              }
              return (
                <BasicNavLink {...attrs}><img src={menu.icon} style={{marginRight: '5px'}} alt=" "/>{menu.key}</BasicNavLink>
              );
            })}
          </SideNav>
        </HeaderLeft>
        <HeaderControls>
          <HeaderElementWrap>
            <Wallet />
            <Menu />
          </HeaderElementWrap>
        </HeaderControls>

        {/*<TrackingGasPrice />*/}
      </RowBetween>
    </HeaderFrame>
  );
});

export default Header;
