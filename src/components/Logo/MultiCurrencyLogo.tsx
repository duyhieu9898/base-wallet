import React from 'react';
import styled from 'styled-components';
import { CurrencyLogoLazyProps } from './index';
import CurrencyLogo from '../CurrencyLogo';

const Wrapper = styled.div<{ width: number; mr?: number; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ mr }) => `${mr}px`};
  width: ${({ width }) => `${width}px`};
  height: ${({ sizeraw }) => `${sizeraw}px`};
`;

interface MultiCurrencyLogoProps {
  mr?: number;
  size?: number;
  currencies?: any[];
}

const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => ((sizeraw * 3) / 4).toFixed(0) + 'px'};
  box-shadow: ${({ sizeraw }) =>
    `0 0 ${Math.max(sizeraw / 4, 2)}px 1px rgba(24, 28, 39, 0.3)`};
`;

const MoreCoveredLogo = styled.div<{ size?: string; sizeraw?: number }>`
  position: absolute;
  left: ${({ sizeraw }) => ((sizeraw * 3) / 4).toFixed(0) + 'px'};
  box-shadow: ${({ sizeraw }) =>
    `0 0 ${Math.max(sizeraw / 4, 2)}px 1px rgba(24, 28, 39, 0.3)`};
  background-color: #fafafa;
  color: #263238;
  width: ${({ size }) => size ?? ''};
  height: ${({ size }) => size ?? ''};
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1;
`;

export default function MultiCurrencyLogo({
  mr = 16,
  size = 24,
  currencies,
  lazy,
  lazyProps,
}: MultiCurrencyLogoProps & CurrencyLogoLazyProps) {
  if (currencies.length > 2) {
    const w = size + (size * 3) / 4;
    return (
      <Wrapper width={w} sizeraw={size} mr={mr}>
        <CoveredLogo
          currency={currencies[0]}
          size={size.toString() + 'px'}
          sizeraw={0}
          // background={'#ffffff'}
          lazy={lazy}
          lazyProps={lazyProps}
        />
        <MoreCoveredLogo size={size.toString() + 'px'} sizeraw={size}>
          {`+${currencies.length - 1}`}
        </MoreCoveredLogo>
      </Wrapper>
    );
  }
  const w = size + (size * (currencies.length - 1) * 3) / 4;
  return (
    <Wrapper width={w} sizeraw={size} mr={mr}>
      {currencies.map((currency, index) => {
        return (
          <CoveredLogo
            key={index}
            currency={currency}
            size={size.toString() + 'px'}
            sizeraw={size * index}
            // background={'#ffffff'}
            lazy={lazy}
            lazyProps={lazyProps}
          />
        );
      })}
    </Wrapper>
  );
}
