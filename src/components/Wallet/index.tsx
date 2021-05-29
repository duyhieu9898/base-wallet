import React from 'react';
import styled from 'styled-components';
import { Activity } from 'react-feather';
import { observer } from 'mobx-react';
import { shortenAddress } from '../../utils';
// import { bnum } from 'utils/helpers';
// import WalletDropdown from '../WalletDropdown';
import WalletDropdown from '../WalletModal';
import Identicon from '../Identicon';
import { useStores } from '../../contexts/storesContext';

import { ButtonPrimary } from '../Button';
import { isMobile } from 'react-device-detect';
import { ChainId } from '../../constants';
import { YellowCard } from '../Card';
// import { MouseoverTooltip } from '../Tooltip';
import { themeProperties } from '../../theme';

const WarningIcon = styled.img`
  width: 22px;
  height: 26px;
  margin-right: 0;
  color: var(--warning);
`;

const WalletButton = styled.button`
  color: ${({ theme }) => theme.primaryButtonColor};
  background-color: ${({ theme }) => theme.primaryButtonBG};
  display: flex;
  flex-flow: row nowrap;
  border: none;
  border-radius: ${themeProperties.defaultRadius};
  padding: 0.5rem;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  height: 36px;
  width: 140px;
  :focus {
    outline: none;
  }
`;

const Error = styled.button`
  background-color: var(--panel);
  border: 1px solid var(--warning);
  display: flex;
  flex-flow: row nowrap;
  font-size: 0.9rem;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
  color: #ffffff;
  font-weight: 500;
`;

const ErrorMessage = styled.span`
  margin: 0 0.5rem 0 0.25rem;
  font-size: 0.83rem;
  color: ${({ theme }) => theme.text1};
`;

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`;

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`;

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`;


const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.KOVAN]: 'Testnet',
  [ChainId.ETH_MAINNET]: 'Ethereum',
};

const Wallet = observer(() => {
  const {
    root: {
      dropdownStore,
      providerStore,
    },
  } = useStores();

  const {
    account,
    activeChainId,
    active,
    error,
    injectedActive,
    injectedLoaded,
  } = providerStore.providerStatus;

  if (!activeChainId && active) {
    // throw new Error(`No chain ID specified ${activeChainId}`);
    console.error(`No chain ID specified ${activeChainId}`);
    return null;
  }

  const toggleWalletDropdown = async () => {
    dropdownStore.toggleWalletDropdown();
  };

  // handle the logo we want to show with the account
  function getStatusIcon() {
    if (injectedActive) {
      return <Identicon />;
    }
  }

  function getWalletDetails() {
    // Wrong network
    if (injectedLoaded && !injectedActive) {
      return (
        <Error onClick={toggleWalletDropdown}>
          <WarningIcon src="/WarningSign.svg" />
          <ErrorMessage>Wrong Network</ErrorMessage>
        </Error>
      );
    } else if (account) {

      return (
        <React.Fragment>
          <TestnetWrapper>
            {!isMobile && activeChainId && NETWORK_LABELS[activeChainId] && (
              <NetworkCard>{NETWORK_LABELS[activeChainId]}</NetworkCard>
            )}
          </TestnetWrapper>

          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <WalletButton onClick={toggleWalletDropdown}>
              {getStatusIcon()}
              <span>{shortenAddress(account)}</span>
            </WalletButton>
          </AccountElement>
        </React.Fragment>
      );
    } else if (error) {
      return (
        <Error onClick={toggleWalletDropdown}>
          <NetworkIcon />
          <ErrorMessage>Error</ErrorMessage>
        </Error>
      );
    } else {
      return (
        <ButtonPrimary
          margin={'0 0 0 0.5rem'}
          height={'35px'}
          padding={`5px ${themeProperties.paddingCard}`}
          onClick={() => {
            toggleWalletDropdown();
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>
            Connect Wallet
          </span>
        </ButtonPrimary>
      );
    }
  }

  return (
    <>
      {getWalletDetails()}
      <WalletDropdown />
    </>
  );
});

export default Wallet;
