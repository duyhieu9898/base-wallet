import React from 'react';
import ReactDOM from 'react-dom';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import 'index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { NetworkContextName } from './constants';
import { web3Window as window } from './provider/Web3Window';
import getLibrary from './utils/getLibrary';


const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

const Root = (
  <React.Suspense fallback="Loading...">
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <App />
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.Suspense>
);
ReactDOM.render(Root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
