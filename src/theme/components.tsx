import React, { HTMLProps, useCallback } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { darken } from 'polished';
import { ArrowLeft, X } from 'react-feather';
// @ts-ignore
import Circle from '../assets/images/circle.svg';
// @ts-ignore
import IconExternalLink from '../assets/images/open-in-new.svg';
import { BoxSpacingProps } from './styled';

export const Button = styled.button.attrs<
  { warning: boolean },
  { backgroundColor: string }
>(({ warning, theme }) => ({
  backgroundColor: warning ? theme.red1 : theme.primary1,
}))`
  padding: 1rem 2rem;
  border-radius: 3rem;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ theme }) => theme.white};
  width: 100%;

  :hover,
  :focus {
    background-color: ${({ backgroundColor }) => darken(0.05, backgroundColor)};
  }

  :active {
    background-color: ${({ backgroundColor }) => darken(0.1, backgroundColor)};
  }

  :disabled {
    background-color: ${({ theme }) => theme.bg1};
    color: ${({ theme }) => theme.text4};
    cursor: auto;
  }
`;

export const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
  color: ${({ theme }) => theme.text2};
  &:hover {
    color: ${({ theme }) => theme.text1};
  }
`;

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
  border: none;
  text-decoration: none;
  background: none;

  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.primary1)};
  font-weight: 500;

  :hover {
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :active {
    text-decoration: none;
  }
`;

// An internal link from the react-router-dom library that is correctly styled
export const StyledInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`;

const StyledLink = styled.a<{ fontSize?: string } & BoxSpacingProps>`
  ${({ theme }) => theme.boxSpacing};
  display: inline-flex;
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primaryDarken1};
  font-weight: 500;
  font-size: ${({ fontSize }) => fontSize ?? ''};

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`;

const ArrowOpenInNew = styled.span`
  font-size: 11px;
  font-family: system-ui, sans-serif;
`;

/**
 * Outbound link that handles firing google analytics events
 */
export function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  children,
  fontSize,
  hiddenArrow,
  onClickCb,
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  href: string;
  fontSize?: string;
  hiddenArrow?: boolean;
  onClickCb?: () => void;
} & BoxSpacingProps) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
    },
    []
  );
  return (
    <StyledLink
      target={target}
      rel={rel}
      href={href}
      fontSize={fontSize}
      onClick={e => {
        handleClick(e);
        onClickCb && onClickCb();
      }}
      {...rest}
    >
      {children}
      {hiddenArrow ? null : <ArrowOpenInNew>↗</ArrowOpenInNew>}
    </StyledLink>
  );
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.img<{ size?: number | string; margin?: string }>`
  animation: 2s ${rotate} linear infinite;
  width: ${({ size }) =>
    size !== undefined
      ? size + (typeof size === 'number' ? 'px' : '')
      : '16px'};
  height: ${({ size }) =>
    size !== undefined
      ? size + (typeof size === 'number' ? 'px' : '')
      : '16px'};
  margin: ${({ margin }) => margin ?? '0 0.25rem 0 0.25rem'};
`;

interface LoadingSpinnerProps {
  size?: string | number;
  margin?: string;
}

export function LoadingSpinner({ size, margin }: LoadingSpinnerProps) {
  return <Spinner src={Circle} size={size} margin={margin} alt={'spinner'} />;
}

export const DotsLoading = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;

const BackArrowLink = styled(StyledInternalLink)`
  color: ${({ theme }) => theme.text1};
`;
export function BackArrow({ to }: { to: string }) {
  return (
    <BackArrowLink to={to}>
      <ArrowLeft />
    </BackArrowLink>
  );
}

const ExternalLinkStyled = styled.a<{
  ml?: string;
  mr?: string;
  fontWeight?: string | number;
}>`
  display: inline-flex;
  color: ${({ theme }) => theme.primaryDarken1};
  text-decoration: none;
  font-weight: ${({ fontWeight }) => fontWeight};
  > img {
    margin-left: ${({ ml }) => ml ?? ''};
    margin-right: ${({ mr }) => mr ?? ''};
  }
`;

export function ExternalLinkIcon({
  prepend,
  append,
  href,
  target = '_blank',
  rel = 'noopener noreferrer',
  ml,
  mr,
  onClick,
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  href: string;
  ml?: string;
  mr?: string;
  fontWeight?: number | string;
  onClick?: (e) => {};
}) {
  return (
    <ExternalLinkStyled
      {...rest}
      href={href}
      target={target}
      rel={rel}
      ml={ml}
      mr={mr}
      onClick={onClick}
    >
      {prepend || null}
      <img
        src={IconExternalLink}
        alt=""
        style={
          prepend ? { marginLeft: '4px' } : append ? { marginRight: '4px' } : {}
        }
      />
      {append || null}
    </ExternalLinkStyled>
  );
}

interface InternalLinkProps {
  fontWeight?: number;
}

export const InternalLink = styled(Link)<
  LinkProps & BoxSpacingProps & InternalLinkProps
>`
  ${({ theme }) => theme.boxSpacing}
  color: ${({ theme }) => theme.primaryDarken1};
  text-decoration: none;
  font-weight: ${({ fontWeight }) => fontWeight ?? ''};
`;

// styles
export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;
