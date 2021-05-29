import React from 'react';
import styled from 'styled-components';
import { AppBar as MuiAppBar,
  IconButtonProps as MuiIconButtonProps,
  AppBarProps as MuiAppBarProps,
  ListItem as MuiListItem,
  ListItemIcon as MuiListItemIcon,
  ListItemIconProps as MuiListItemIconProps,
  ListItemProps as MuiListItemProps,
  IconButton,
} from '@material-ui/core';
import { Menu, MenuOpen } from '@material-ui/icons';
import { transparentize } from 'polished';
import { themeProperties } from '../../theme';

export const DRAWER_MIN_WIDTH: string = '55px';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export const AppBar = styled(MuiAppBar)<AppBarProps>`
  && {
    position: fixed;
    top: 0;
    background-color: ${({ theme }) => theme.sidebar};
    z-index: 21;
    transition: width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms,
      margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
    min-height: 52px;
    display: flex;
    justify-content: center;
    padding: 0 20px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
    padding-left: ${themeProperties.paddingCard};
    ${({ theme }) => theme.mediaWidth.upToSmall`
      position: unset;
      top: unset;
    `}
  `}
  }
`;

interface IconButtonProps extends MuiIconButtonProps {
  open?: boolean;
}

export const MenuIconButton = styled(({ open, ...rest }) => {
  return <IconButton {...rest}>{open ? <MenuOpen /> : <Menu />}</IconButton>;
})<IconButtonProps>`
  && {
    padding: 5px 0;
    margin-left: -5px;
    color: ${({ theme }) => theme.text2};
    ${({ theme }) => theme.mediaWidth.upToMedium`
      display: none;
    `}
  }
`;
export const StyledToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${themeProperties.paddingCard};
`;

export const ListItem = styled(props => (
  <MuiListItem classes={{ button: 'button' }} {...props} />
))<MuiListItemProps>`
  &.button {
    &:hover {
      background-color: rgba(255, 255, 255, 0.04);
    }
    &.sub-menu {
      background-color: ${({ theme }) => transparentize(0.6, theme.cardBG)};
    }
    &.active {
      & > .MuiListItemIcon-root {
        background-color: ${({ theme }) => theme.primaryButtonBG};
      }
      & > .MuiListItemText-root {
        & > .MuiTypography-root {
          font-weight: 600 !important;
        }
      }
    }
  }
`;

export const ListItemIcon = styled(MuiListItemIcon)<MuiListItemIconProps>`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    min-width: auto;
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.selectionBG};
    border-radius: ${themeProperties.defaultRadius};
    padding-left: 2px;
    margin-right: 12px;
    & svg {
      font-size: 20px;
    }
    & img {
      width: auto;
      height: 20px;
    }
  }
`;
