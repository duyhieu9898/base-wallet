import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { web3Window as window } from 'provider/Web3Window';
import { usePrevious } from 'utils/helperHooks';
import { useStores } from 'contexts/storesContext';
import Modal from '../Modal';
import AccountDetails from '../AccountDetails';

const Lightbox = styled.div`
  text-align: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  margin-left: -50vw;
  top: 78px;
  pointer-events: none;
  left: 50%;
  z-index: 2;
  will-change: opacity;
  background-color: ${({ theme }) => theme.modalBG};
`;

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  position: absolute;
  top: 0px;
  right: 25px;
  transition: all 0.5s ease;
  margin: 0;
  pointer-events: auto;
  z-index: 100;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 0 0 4px 4px;
`;

const ModalWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`;

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const handleClick = event => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    const handleKeyUp = event => {
      if (event.key !== 'Escape') {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKeyUp, false);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKeyUp, false);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [ref, handler]);
}

const WalletDropdown = observer(() => {
  const {
    root: { dropdownStore, providerStore },
  } = useStores();

  const active = providerStore.providerStatus.active;
  const error = providerStore.providerStatus.error;
  const account = providerStore.providerStatus.account;
  const injectedActive = providerStore.providerStatus.injectedActive;
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

  const walletDropdownOpen = dropdownStore.walletDropdownVisible;

  const toggleWalletDropdown = () => {
    dropdownStore.toggleWalletDropdown();
  };

  // always reset to account view
  useEffect(() => {
    if (walletDropdownOpen) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [walletDropdownOpen]);

  const ref = useRef();
  useOnClickOutside(ref, () => dropdownStore.toggleWalletDropdown());

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  useEffect(() => {
    if (walletDropdownOpen && active && !activePrevious) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [setWalletView, active, error, walletDropdownOpen, activePrevious]);

  async function loadWalletDropdown() {
    if (walletDropdownOpen) {
      toggleWalletDropdown();
    }
    setWalletView(WALLET_VIEWS.ACCOUNT);
    await providerStore.loadWeb3Modal();
  }

  if (account && injectedActive && walletView === WALLET_VIEWS.ACCOUNT) {
    return (
      <Modal
        isOpen={walletDropdownOpen}
        onDismiss={toggleWalletDropdown}
        minHeight={false}
      >
        <ModalWrapper>
          <AccountDetails
            toggleWalletModal={toggleWalletDropdown}
            openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
          />
        </ModalWrapper>
      </Modal>
    );
  }

  if (walletDropdownOpen) {
    return (
      <Lightbox>
        <Wrapper ref={ref}>{loadWalletDropdown()}</Wrapper>
      </Lightbox>
    );
  }

  return null;
});

export default WalletDropdown;
