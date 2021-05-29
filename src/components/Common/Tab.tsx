import React from 'react';
import styled, { css } from 'styled-components';
import {
  Tabs as MuiTabs,
  TabsProps as MuiTabsProps,
  Tab as MuiTab,
  TabProps as MuiTabProps,
} from '@material-ui/core';
import { themeProperties } from '../../theme';
import { transparentize } from 'polished';

interface TabsProps {
  dense?: boolean;
  outlined?: boolean;
  gutter?: number;
}

export const Tabs = styled(
  ({ dense, outlined, gutter, ...props }: MuiTabsProps & TabsProps) => {
    return <MuiTabs classes={{ indicator: 'indicator' }} {...props} />;
  }
)`
  ${({ dense }) =>
    dense &&
    css`
      && {
        min-height: 32px;
      }
    `}
  & .indicator {
    background-color: ${({ theme }) => theme.primary1};
    ${({ outlined }) =>
      outlined &&
      css`
        display: none;
      `}
  }
  & .MuiTab-root {
    margin-right: ${({ gutter }) => (gutter ? `${gutter}px` : '')};
    margin-bottom: ${({ gutter }) => (gutter ? `${gutter}px` : '')};

    ${({ outlined, theme }) =>
      outlined &&
      css`
        color: ${theme.v2GreyColor};
        border: 1px solid ${theme.v2BorderColor};
        border-radius: ${themeProperties.defaultRadius};

        &.Mui-selected {
          color: ${theme.v2Primary};
          background-color: ${transparentize(0.8, theme.v2Primary)};
          border-color: ${theme.v2Primary};
        }
      `}
    ${({ dense }) =>
      dense &&
      css`
        min-height: 32px;
        padding: 3px 6px;
        line-height: 1.5;
        min-width: 125px;
      `}
  }
`;

interface TabProps {
  index: number;
}

export const Tab = styled(({ index, ...props }: MuiTabProps & TabProps) => {
  return (
    <MuiTab
      {...props}
      id={`simple-tabpanel-${index}`}
      aria-controls={`simple-tabpanel-${index}`}
    />
  );
})`
  && {
    text-transform: none;
    font-size: 1rem;
  }
`;

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: any;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, index, value, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};
