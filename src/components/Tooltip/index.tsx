import React, { ReactNode, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Tooltip } from '@material-ui/core';
import Popover, { PopoverProps } from '../Popover';

const TooltipBase = styled(
  ({ title, onClose = function() {}, children, ...props }) => {
    if (title === undefined) {
      return children;
    }
    return (
      <Tooltip
        arrow
        classes={{
          popper: props.className,
          arrow: 'arrow',
          tooltip: 'tooltip',
        }}
        title={title}
        onClose={onClose}
        {...props}
      >
        {children}
      </Tooltip>
    );
  }
)`
  & .arrow {
    color: ${({ theme }) => theme.bg2};
    border-color: ${({ theme }) => theme.bg3};
  }
  & .tooltip {
    font-size: ${({ fontSize }) => fontSize ?? '1rem'};
    color: ${({ theme }) => theme.text2};
    background-color: ${({ theme }) => theme.tooltipBG};
    border: 1px solid ${({ theme }) => theme.borderColor};
    & a {
      color: ${({ theme }) => theme.primary1};
      text-decoration: none;
    }
  }
`;

export default TooltipBase;

const TooltipContainer = styled.div`
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 400;
`;

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: string | ReactNode;
}

function CustomTooltip({ text, ...rest }: TooltipProps) {
  return (
    <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
  );
}

export function MouseoverTooltip({
  children,
  ...rest
}: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <CustomTooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </CustomTooltip>
  );
}
