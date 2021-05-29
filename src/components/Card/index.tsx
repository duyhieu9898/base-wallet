import React from 'react';
import styled, { css } from 'styled-components';
import { Box } from 'rebass/styled-components';
import { themeProperties } from '../../theme';
import { darken } from 'polished';
import { BoxSpacingProps } from 'theme/styled';

interface CardProps {
  padding?: number | string;
  border?: string;
  borderRadius?: string;
  bordered?: boolean;
  hovered?: boolean;
  height?: string;
  backgroundColor?: 'default' | string;
}

const Card = styled(Box)<CardProps>`
  width: 100%;
  height: ${({ height }) => height};
  padding: ${({ padding }) => padding ?? themeProperties.paddingCard};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) =>
    borderRadius ?? themeProperties.defaultRadius};
  background-color: ${({ theme, backgroundColor: bg }) =>
    bg === 'default' ? theme.bg0 : theme.v2SectionColor};
  ${({ bordered }) =>
    bordered &&
    css`
      border: 1px solid ${({ theme }) => theme.borderColor};
      ${({ hovered }: any) =>
        hovered &&
        css`
          cursor: pointer;
          &:hover {
            border-color: ${({ theme }) => theme.borderHover};
          }
        `}
    `}
  ${({ hovered }) =>
    hovered &&
    css`
      cursor: pointer;
    `}
`;
export const OutlineCard2 = styled(Box)<CardProps>`
  width: 100%;
  height: ${({ height }) => height};
  padding: ${({ padding }) => padding ?? themeProperties.paddingCard};
  border-radius: ${({ borderRadius }) =>
    borderRadius ?? themeProperties.defaultRadius};
  background-color: ${({ theme }) => theme.v2BgSection};
  background-clip: padding-box;
  ${({ bordered }) =>
    bordered &&
    css`
      ${({ hovered }: any) =>
        hovered &&
        css`
          cursor: pointer;
          &:hover {
            border-color: ${({ theme }) => theme.borderHover};
          }
        `}
    `}
  ${({ hovered }) =>
    hovered &&
    css`
      cursor: pointer;
    `}
`;
export default Card;

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.cardBG2};
  color: ${({ theme }) => theme.text1};
`;

export const OutlinedCard = props => {
  return <Card bordered {...props} />;
};

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`;

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`;

export const BlankCard = styled.div<
  {
    padding?: string;
  } & BoxSpacingProps
>`
  padding: ${({ padding }) => padding ?? themeProperties.paddingCard};
  ${({ theme }) => theme.boxSpacing};
`;

export const HoverCard = styled(Card)<{ active?: boolean }>`
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme, active }) => active && theme.cardBG};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.borderColor)};
  }
`;
