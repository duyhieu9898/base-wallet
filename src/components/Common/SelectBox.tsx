import React from 'react';
import styled from 'styled-components';
import {
  FormControl,
  InputLabel,
  Select as MSelect,
  SelectProps as MSelectProps,
  MenuItem as MMenuItem,
  InputBase,
} from '@material-ui/core';
import { themeProperties } from '../../theme';

const StyledFormControl = styled(FormControl)<{ mb?: string; width?: string }>`
  && {
    margin-bottom: ${({ mb }) => mb ?? ''};
    & > label {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.text1};
    }
    width: ${({ width }) => width ?? ''};
  }
`;

const StyledInputLabel = styled(props => {
  return <InputLabel classes={{ shrink: 'shrink' }} {...props} />;
})<{ fontSize?: string }>`
  && {
    font-size: ${({ fontSize }) => fontSize ?? ''} !important;
  }
  &.shrink {
    transform: translate(0, 1.5px);
  }
`;

const BootstrapInput = styled(props => {
  return <InputBase classes={{ input: 'select-input' }} {...props} />;
})<{ placeholder?: string }>`
  label + & {
    margin-top: 24px;
  }
  .select-input {
    display: flex;
    align-items: center;
    min-height: 48px;
    box-sizing: border-box;
    color: ${({ theme }) => theme.text1};
    border-radius: ${themeProperties.defaultRadius};
    position: relative;
    border: 1px solid ${({ theme }) => theme.borderColor};
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    transition: border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    &:focus {
      border-radius: ${themeProperties.defaultRadius};
      border-color: ${({ theme }) => theme.borderHover};
    }
    &:before {
      content: '${({ value, placeholder }) =>
        !value && value !== 0 ? placeholder : ''}';
      position: absolute;
      top: 50%;
      left: 1rem;
      color: ${({ theme }) => theme.text4};
      transform: translateY(-50%);
    }
  }
  .MuiSelect-icon {
    color: ${({ theme }) => theme.primary1};
  }
`;

interface SelectProps extends MSelectProps {
  id: string;
  label?: string;
  labelProps?: any;
  mb?: string;
  width?: string;
}

export const Select = ({
  id,
  mb,
  label,
  width,
  labelProps = {},
  ...rest
}: SelectProps) => {
  return (
    <StyledFormControl mb={mb} width={width}>
      {label ? (
        <StyledInputLabel shrink htmlFor={id} {...labelProps}>
          {label}
        </StyledInputLabel>
      ) : null}
      <MSelect id={id} {...rest} input={<BootstrapInput />} />
    </StyledFormControl>
  );
};

export const Option = styled(MMenuItem)``;
