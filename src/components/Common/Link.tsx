import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getEtherscanLink } from '../../utils';
import { ExternalLink } from '../../theme';
import { useStores } from '../../contexts/storesContext';

const LinkStyled = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`;

export const LinkPrimary = props => {
  return <LinkStyled {...props} />;
};

interface EtherscanLinkProps {
  address: string;
  type?: 'transaction' | 'token' | 'address' | 'block';
  children: React.ReactNode;
}

export const EtherscanLink = ({
  address,
  type = 'address',
  children,
}: EtherscanLinkProps) => {
  const {
    root: { providerStore },
  } = useStores();
  const { activeChainId } = providerStore.providerStatus;

  return (
    <ExternalLink href={getEtherscanLink(activeChainId, address, type)}>
      {children}
    </ExternalLink>
  );
};
