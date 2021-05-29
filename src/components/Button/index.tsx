import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { darken } from 'polished';
import { Link } from 'react-router-dom';
import { Button as RebassButton } from 'rebass/styled-components';
import { themeProperties } from '../../theme';

const enumBaseButton = {
  medium: {
    padding: '12px',
    minHeight: '48px',
  },
  small: {
    padding: '10px',
    minHeight: '42px',
  },
  xsm: {
    padding: '7px 0',
    minHeight: 'auto',
  },
  default: {
    padding: '18px',
    minHeight: '0',
  },
};

interface BaseAttrs {
  minHeight?: string;
  padding?: string;
  margin?: string;
  width?: string;
  minWidth?: string;
  borderRadius?: string;
  altDisabledStyle?: boolean;
  bg?: string;
  size?: 'medium' | 'small' | 'default';
  fontSize?: string;
  type?: 'link';
  to?: string;
}

const Base = styled(({ type, to, ...rest }) => {
  if (type === 'link') {
    const restLink = _.pick(rest, ['className', 'children', 'onClick']);
    return <Link to={to} {...restLink} />;
  }
  return <RebassButton {...rest} />;
}).attrs<BaseAttrs>(props => ({
  size: props.size || 'default',
}))`
  min-height: ${({ minHeight, size }) =>
    minHeight ?? enumBaseButton[size]?.minHeight};
  padding: ${({ padding, size }) =>
    padding ? padding : enumBaseButton[size]?.padding};
  margin: ${({ margin }) => margin};
  width: ${({ width }) => (width ? width : '100%')};
  min-width: ${({ minWidth }) => minWidth ?? ''};
  font-size: ${({ fontSize }) =>
    fontSize === 'small' ? '0.875rem' : fontSize ?? '1rem'};
  font-weight: 700;
  text-align: center;
  border-radius: ${({ borderRadius }) =>
    borderRadius ?? themeProperties.defaultRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`;

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.primary2};
  color: ${({ theme }) => theme.primaryButtonColor};
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary2)};
    background-color: ${({ theme }) => darken(0.05, theme.primary2)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary2)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary2)};
    background-color: ${({ theme }) => darken(0.1, theme.primary2)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) =>
      altDisabledStyle ? theme.primary2 : theme.bg3};
    color: ${({ theme, altDisabledStyle }) =>
      altDisabledStyle ? 'white' : theme.text3};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`;



export const ButtonSecondary = styled(Base)`
  background-color: ${({ theme, bg }) => bg || theme.secondaryButtonBG};
  color: ${({ theme }) => theme.primaryButtonColor};
  border-radius: 8px;

  &:focus {
    box-shadow: 0 0 0 1pt
      ${({ theme, bg }) => darken(0.1, bg || theme.secondaryButtonBG)};
    background-color: ${({ theme, bg }) =>
      darken(0.1, bg || theme.secondaryButtonBG)};
  }
  &:hover {
    background-color: ${({ theme, bg }) =>
      darken(0.1, bg || theme.secondaryButtonBG)};
  }
  &:active {
    box-shadow: 0 0 0 1pt
      ${({ theme, bg }) => darken(0.05, bg || theme.secondaryButtonBG)};
    background-color: ${({ theme, bg }) =>
      darken(0.05, bg || theme.secondaryButtonBG)};
  }
  &:disabled {
    background-color: ${({ theme, bg }) =>
      darken(0.03, bg || theme.secondaryButtonBG)};
    opacity: 0.5;
    cursor: auto;
  }
`;


// Button
const Container = styled.div`
  font-family: var(--roboto);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonBase = styled.div`
  border-radius: 8px;
  width: 163px;
  height: 40px;

  font-family: var(--roboto);
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ActiveButton = styled(ButtonBase)`
  background: ${({ theme }) => theme.primaryButtonBG};
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.primaryButtonColor};
  cursor: pointer;
`;

const InactiveButton = styled(ButtonBase)`
  background: ${({ theme }) => theme.primaryButtonBG};
  border: 1px solid var(--inactive-button-border);
  color: var(--inactive-button-text);
`;

const Button = ({ buttonText, active, onClick }) => {
  const ButtonDisplay = ({ activeButton, children }) => {
    if (activeButton) {
      return <ActiveButton onClick={onClick}>{children}</ActiveButton>;
    } else {
      return <InactiveButton>{children}</InactiveButton>;
    }
  };

  return (
    <Container>
      <ButtonDisplay activeButton={active}>{buttonText}</ButtonDisplay>
    </Container>
  );
};

export default Button;
