import React from 'react';
import { transparentize } from 'polished';
import styled from 'styled-components';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { CheckSquare } from 'react-feather';

const StyledFormControlLabel = styled(({ colorOverride, ...props }) => (
  <FormControlLabel
    classes={{ label: 'label', disabled: 'disabled' }}
    {...props}
  />
))`
  && {
    color: ${({ theme, colorOverride }) => colorOverride || theme.primary1};
  }
  &.disabled {
    color: ${({ theme }) => theme.text2};
  }
  &:hover span {
    color: inherit;
  }
  & .label {
    color: inherit;
    font-size: ${({ fontSize }) => fontSize ?? 'inherit'};
  }
  & .label.disabled {
    color: inherit;
    cursor: auto;
  }
`;

const StyledCheckbox = styled(({ colorOverride, ...props }) => (
  <Checkbox
    classes={{
      colorSecondary: 'color-secondary',
      checked: 'checked',
      disabled: 'disabled',
    }}
    {...props}
  />
))`
  &.color-secondary {
    color: ${({ theme, colorOverride }) =>
      transparentize(0.5, colorOverride || theme.primary1)};
    :hover,
    :hover span {
      color: ${({ theme }) => theme.primary1};
    }
    &.checked {
      color: ${({ theme }) => theme.primary1};
    }
    &.disabled {
      color: ${({ theme }) => transparentize(0.8, theme.text2)};
    }
  }
`;

interface CheckboxPrimaryProps {
  label?: string | React.ReactNode;
  fontSize?: string;
  color?: string;
  disabled?: boolean;
  [key: string]: any;
}

export const CheckboxPrimary = ({
  label,
  fontSize = '',
  color,
  disabled = false,
  ...props
}: CheckboxPrimaryProps) => {
  if (label) {
    return (
      <StyledFormControlLabel
        disabled={disabled}
        label={label}
        fontSize={fontSize}
        colorOverride={color}
        control={
          <StyledCheckbox
            disabled={disabled}
            checkedIcon={<CheckSquare />}
            colorOverride={color}
            {...props}
          />
        }
      />
    );
  }
  return <StyledCheckbox {...props} />;
};
