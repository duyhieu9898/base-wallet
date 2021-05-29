import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useWeb3React } from '@web3-react/core';
import { useStores } from '../../contexts/storesContext';
import PreLoader from '../PreLoader';
import { NetworkContextName } from '../../constants';
import { useEagerConnect } from '../../hooks';
import { injected, network } from '../../provider/connectors';

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh);
  background-color: ${({ theme }) => theme.bg0};
`;

const Web3Manager = observer(({ children }) => {
  const {
    root: { providerStore},
  } = useStores();
  const { active, account, library, connector } = useWeb3React();
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React(NetworkContextName);

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  // useInactiveListener(!triedEager);

  useEffect(() => {
    if (connector !== injected && active && account && library) {
      providerStore.loadWeb3(library?.provider);
    }
  }, [providerStore, active, account, library, connector]);

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // This means no injected web3 and infura backup has failed
  if (!providerStore.providerStatus.active) {
    return showLoader ? (
      <MessageWrapper>
        {/*<Spinner src={Circle} />*/}
        <PreLoader />
      </MessageWrapper>
    ) : null;
  }

  return children;
});

export default Web3Manager;
