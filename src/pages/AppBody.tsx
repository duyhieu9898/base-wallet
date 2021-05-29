import React from 'react';
import styled, { css } from 'styled-components';
import { themeProperties } from '../theme';
import { BoxSpacingProps } from '../theme/styled';

export const BodyWrapper = styled.div<
  {
    padding?: string | number;
    maxWidth?: number | string;
    bordered?: boolean;
    background?: string;
  } & BoxSpacingProps
>`
  ${({ theme }) => theme.boxSpacing}
  position: relative;
  max-width: ${({ maxWidth }) => maxWidth ?? '450px'};
  width: 100%;
  background-color: ${({ theme, background }) => background ?? theme.cardBG};
  box-shadow: 0 2px 8px 2px rgba(21, 25, 35, 0.1);
  ${({ bordered }) =>
    bordered &&
    css`
      border: 1px solid ${({ theme }) => theme.borderColor};
    `}
  border-radius: ${themeProperties.defaultRadius};
  padding: ${({ padding }) =>
    padding || padding === 0 ? padding : themeProperties.paddingCard};
  // z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    box-sizing: border-box;
  `}
`;

const maxWidthConfig = {
  xs: 420,
  sm2: 500,
  sm: 600,
  md: 810,
  md2: 980,
};

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  className,
  padding,
  maxWidth,
  bordered = true,
  background,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  padding?: number | string;
  maxWidth?: 'sm' | 'md' | 'md2' | 'sm2' | number | string;
  bordered?: boolean;
  background?: string;
} & BoxSpacingProps) {
  let mw = maxWidthConfig[maxWidth] ?? maxWidth;
  if (typeof mw === 'number') {
    mw = mw + 'px';
  }
  return (
    <BodyWrapper
      className={className}
      padding={padding}
      maxWidth={mw}
      bordered={bordered}
      background={background}
      {...props}
    >
      {children}
    </BodyWrapper>
  );
}

export const AppContent = styled.div`
  padding: ${themeProperties.paddingCard};
`;

const StyledAppContainer = styled.div<{ maxWidth?: number | string }>`
  max-width: ${({ maxWidth }) => maxWidth ?? '420px'};
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    box-sizing: border-box;
  `}
`;
export const AppContainer = function({
  children,
  maxWidth,
}: {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | number | string;
}) {
  let mw = maxWidthConfig[maxWidth] ?? maxWidth;
  if (typeof mw === 'number') {
    mw = mw + 'px';
  }
  return <StyledAppContainer maxWidth={mw}>{children}</StyledAppContainer>;
};
