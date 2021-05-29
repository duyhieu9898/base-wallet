import React, { useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Menu as MenuIcon } from 'react-feather';
import { ExternalLink } from '../../theme';
import { MENU_ITEMS } from '../layout/AppLayout';

const StyledMenuButton = styled.button`
  width: 100%;
  border: none;
  margin: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`;

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: none;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: flex;
  `}
`;

const MenuFlyout = styled.div`
  min-width: 10.125rem;
  background-color: ${({ theme }) => theme.tooltipBG};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
`;

const MenuItem = styled(({ to, ...props }) => {
  return to ? <NavLink to={to} {...props} /> : <ExternalLink {...props} />;
})`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: ${({ theme }) => theme.text2};
  text-decoration: none;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  & > svg,
  & > img {
    margin-right: 8px;
    width: 14px;
  }
`;

export default function Menu() {
  const node = useRef<HTMLDivElement>();
  const [open, toggle] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = e => {
      if (node.current?.contains(e.target) ?? false) {
        return;
      }
      toggle(v => !v);
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, toggle]);

  return (
    <StyledMenu ref={node}>
      <StyledMenuButton
        onClick={() => {
          toggle(v => !v);
        }}
      >
        <MenuIcon color={'#fff'} size={20} />
      </StyledMenuButton>
      {open && (
        <MenuFlyout onClick={() => toggle(false)}>
          {MENU_ITEMS.length
            ? MENU_ITEMS.map(menu => {
                const attrs: any = {};
                if (menu.to) {
                  attrs.to = menu.to;
                  attrs.exact = menu.exact;
                } else if (menu.href) {
                  attrs.href = menu.href;
                  attrs.target = '_blank';
                  attrs.rel = 'noopener noreferrer';
                }
                return (
                  <MenuItem {...attrs} key={menu.key}>
                    {menu.icon || null}
                    {menu.key}
                  </MenuItem>
                );
              })
            : null}
        </MenuFlyout>
      )}
    </StyledMenu>
  );
}
