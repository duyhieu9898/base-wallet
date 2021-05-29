import React from 'react';
import styled from 'styled-components';
import { Info } from '@material-ui/icons';
import { BoxSpacingProps } from '../../theme/styled';


const ExternalTextWrapper = styled.span`
  display: flex;
  align-items: flex-start;
`;

const ArrowOpenInNew = styled.span`
  font-size: 11px;
  font-family: system-ui;
`;

interface ExternalTextProps {
  children: React.ReactNode;
  // as?: string | React.ReactElement | React.ReactFragment;
  [attr: string]: any;
}

export function ExternalText({ children, ...props }: ExternalTextProps) {
  return (
    <ExternalTextWrapper {...props}>
      {children}
      <ArrowOpenInNew>↗</ArrowOpenInNew>
    </ExternalTextWrapper>
  );
}

export const DottedSpacer = styled.div`
  flex: 1;
  height: 1px;
  /*
  background-image: ${({ theme }) =>
    theme.dark
      ? `
    linear-gradient(
      to right,
      rgba(255, 255, 255, 0.15) 20%,
      rgba(255, 255, 255, 0) 0%
    )
  `
      : `
    linear-gradient(
      to right,
      rgba(0, 0, 0, 0.15) 20%,
      rgba(0, 0, 0, 0) 0%
    )
  `};
  background-position: center bottom;
  background-size: 0.5rem 0.0625rem;
  background-repeat: repeat-x;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  */
  position: relative;
  top: -0.25rem;
  margin-top: auto;
`;


export const InfoIcon = props => {
  return <Info {...props} />;
};

export const LineBreak = styled.div<BoxSpacingProps>`
  ${({ theme }) => theme.boxSpacing}
  height: 1px;
  background-color: ${({ theme }) => theme.borderColor};
`;
