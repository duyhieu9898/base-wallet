import { action, observable, computed } from 'mobx';
import RootStore from 'stores/Root';
import { ethers } from 'ethers';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import * as Sentry from '@sentry/react';
import { ActionResponse, sendAction } from './actions/actions';
import { web3Window as window } from 'provider/Web3Window';
import { networkConnectors } from '../provider/networkConnectors';
import { isTxReverted } from '../utils/helpers';
import MiniRpcProvider from '../provider/MiniRpcProvider';
import { EtherBigNumber } from '../utils/bignumber';

export interface ChainData {
  currentBlockNumber: number;
  gasPrice?: number;
}

enum ERRORS {
  UntrackedChainId = 'Attempting to access data for untracked chainId',
  ContextNotFound = 'Specified context name note stored',
  BlockchainActionNoAccount = 'Attempting to do blockchain transaction with no account',
  BlockchainActionNoChainId = 'Attempting to do blockchain transaction with no chainId',
  BlockchainActionNoResponse = 'No error or response received from blockchain action',
  NoWeb3 = 'Error Loading Web3',
}

// type ChainDataMap = ObservableMap<number, ChainData>;

export interface ProviderStatus {
  activeChainId: number;
  account: string;
  library: any;
  active: boolean;
  injectedLoaded: boolean;
  injectedActive: boolean;
  injectedChainId: number;
  injectedWeb3: any;
  backUpLoaded: boolean;
  backUpWeb3: any;
  activeProvider: any;
  web3Provider: any;
  error: Error;
}

export default class ProviderStore {
  @observable chainData: ChainData;
  @observable providerStatus: ProviderStatus;
  @observable countFetchUserBlockchainData: number;
  @observable initializedProvider: boolean;
  @observable gasPrice: number;
  estimatedBlocksPerDay: number;
  rootStore: RootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.chainData = { currentBlockNumber: -1 } as ChainData;
    this.providerStatus = {} as ProviderStatus;
    this.providerStatus.active = false;
    this.providerStatus.injectedLoaded = false;
    this.providerStatus.injectedActive = false;
    this.providerStatus.backUpLoaded = false;
    this.providerStatus.activeProvider = null;
    this.providerStatus.web3Provider = null;
    this.initializedProvider = false;
    this.countFetchUserBlockchainData = 0;
    this.estimatedBlocksPerDay = 6500;

    this.handleNetworkChanged = this.handleNetworkChanged.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
  }

  @computed get currentBlockNumber(): number {
    return this.chainData.currentBlockNumber;
  }

  @computed get activeChainId(): number {
    return this.providerStatus.activeChainId;
  }

  getCurrentBlockNumber(): number {
    return this.chainData.currentBlockNumber;
  }

  async loadWeb3Modal(): Promise<void> {
    // let provider = await this.web3Modal.connect();
    console.log(`[Provider] Web3Modal`);
    // if (provider) await this.loadWeb3(provider);
  }

  @action setCurrentBlockNumber(blockNumber): void {
    this.chainData.currentBlockNumber = blockNumber;
  }

  @action setAccount(account): void {
    this.providerStatus.account = account;
  }

  @action setActiveChainId = (chainId): void => {
    networkConnectors.setCurrentChainId(chainId);
    this.providerStatus = Object.assign({}, this.providerStatus, {
      activeChainId: chainId,
    });
  };

  // account is optional
  getProviderOrSigner(library, account) {
    console.debug('[getProviderOrSigner', {
      library,
      account,
      signer: library.getSigner(account),
    });

    return account
      ? new UncheckedJsonRpcSigner(library.getSigner(account))
      : library;
  }

  getSigner() {
    return this.getProviderOrSigner(
      this.providerStatus.library,
      this.providerStatus.account
    );
  }



  getWeb3Provider(): Web3Provider | undefined {
    if (this.providerStatus.activeProvider) {
      const web3Provider = new Web3Provider(
        this.providerStatus.activeProvider,
        'any'
      );
      web3Provider.pollingInterval = 15000;
      return web3Provider;
    }
    return undefined;
  }

  @action sendTransaction = async (
    contractType: ContractTypes | any[],
    contractAddress: string,
    action: string,
    params: any[],
    _overrides?: any,
    summary?: string
  ): Promise<ActionResponse> => {
    const { activeChainId: chainId, account } = this.providerStatus;

    const overrides = _overrides || {};

    if (!account) {
      throw new Error(ERRORS.BlockchainActionNoAccount);
    }

    if (!chainId) {
      throw new Error(ERRORS.BlockchainActionNoChainId);
    }

    const contract = this.getContract(contractType, contractAddress, account);

    // if (!overrides.gasLimit) {
    //   const gasEstimate = await this.estimateSafeGas(
    //     contractType,
    //     contractAddress,
    //     action,
    //     params,
    //     overrides
    //   );
    //   if (gasEstimate?.gas) {
    //     overrides.gasLimit = gasEstimate?.gas;
    //   }
    // }

    const response = await sendAction({
      contract,
      action,
      sender: account,
      data: params,
      overrides,
    });

    const { error, txResponse } = response;

    if (error) {
      console.warn('[Send Transaction Error', error);
      Sentry.captureException(
        JSON.stringify({
          method: action,
          address: contractAddress,
          sender: account,
          args: params,
          overrides,
          error: error?.message,
        })
      );
      // Sentry.captureException(error);
    } else if (txResponse) {

    } else {
      throw new Error(ERRORS.BlockchainActionNoResponse);
    }

    return response;
  };

  @action sendTransactionWithEstimatedGas = async (
    contractType: ContractTypes | any[],
    contractAddress: string,
    action: string,
    params: any[],
    overrides?: any,
    summary?: string
  ): Promise<ActionResponse> => {
    const safeGasEstimate: {
      gas?: EtherBigNumber;
      error?: Error;
    } = await this.estimateSafeGas(
      contractType,
      contractAddress,
      action,
      params,
      overrides
    );

    if (!EtherBigNumber.isBigNumber(safeGasEstimate?.gas)) {
      let errorMessage: string = 'This transaction would fail.';
      if (safeGasEstimate?.error) {
        errorMessage = safeGasEstimate.error?.message;
      }
      console.error(errorMessage);
      return { error: new Error(errorMessage) } as ActionResponse;
    } else {
      overrides.gasLimit = safeGasEstimate.gas;

      try {
        return this.sendTransaction(
          contractType,
          contractAddress,
          action,
          params,
          overrides,
          summary
        );
      } catch (e) {
        if (!e || isTxReverted(e)) {
          return e;
        }
        return {
          error: new Error('Oops, something went wrong'),
        } as ActionResponse;
      }
    }
  };

  @action
  async handleNetworkChanged(networkId: string | number): Promise<void> {
    console.log(
      `[Provider] Network change: ${networkId} ${this.providerStatus.active}`
    );
    // network change could mean switching from injected to backup or vice-versa
    if (this.providerStatus.active) {
      await this.loadWeb3();
    }
  }

  @action
  async handleClose(): Promise<void> {
    console.log(`[Provider] HandleClose() ${this.providerStatus.active}`);
    if (this.providerStatus.active) await this.loadWeb3();
  }

  @action handleAccountsChanged(accounts: string[]): void {
    console.log(`[Provider] Accounts changed`);
    if (accounts.length === 0) {
      this.handleClose();
    } else {
      this.setAccount(accounts[0]);
    }
  }

  @action
  async loadProvider(provider) {
    try {
      // remove any old listeners
      if (
        this.providerStatus.activeProvider &&
        this.providerStatus.activeProvider.on
      ) {
        console.log(`[Provider] Removing Old Listeners`);
        this.providerStatus.activeProvider.removeListener(
          'chainChanged',
          this.handleNetworkChanged
        );
        this.providerStatus.activeProvider.removeListener(
          'accountsChanged',
          this.handleAccountsChanged
        );
        this.providerStatus.activeProvider.removeListener(
          'close',
          this.handleClose
        );
        this.providerStatus.activeProvider.removeListener(
          'networkChanged',
          this.handleNetworkChanged
        );
      }

      if (this.providerStatus.library && this.providerStatus.library.close) {
        console.log(`[Provider] Closing Old Library.`);
        await this.providerStatus.library.close();
      }

      let web3 = new ethers.providers.Web3Provider(provider);

      if ((provider as any).isMetaMask) {
        console.log(`[Provider] MetaMask Auto Refresh Off`);
        (provider as any).autoRefreshOnNetworkChange = false;
      }

      if (provider.on) {
        console.log(`[Provider] Subscribing Listeners`);
        provider.on('chainChanged', this.handleNetworkChanged); // For now assume network/chain ids are same thing as only rare case when they don't match
        provider.on('accountsChanged', this.handleAccountsChanged);
        provider.on('close', this.handleClose);
        provider.on('networkChanged', this.handleNetworkChanged);
      }

      let network = await web3.getNetwork();
      const accounts = await web3.listAccounts();
      let account = null;
      if (accounts.length > 0) account = accounts[0];

      this.providerStatus.injectedLoaded = true;
      this.providerStatus.injectedChainId = network.chainId;
      this.setAccount(account);
      this.providerStatus.injectedWeb3 = web3;
      this.providerStatus.activeProvider = provider;
      const web3Provider = new Web3Provider(provider, 'any');
      web3Provider.pollingInterval = 15000;
      this.providerStatus.web3Provider = web3Provider;
      console.log(`[Provider] Injected provider loaded.`);
    } catch (err) {
      console.error(`[Provider] Injected Error`, err);
      this.providerStatus.injectedLoaded = false;
      this.providerStatus.injectedChainId = null;
      this.setAccount(null);
      this.providerStatus.library = null;
      this.providerStatus.active = false;
      this.providerStatus.activeProvider = null;
      this.providerStatus.web3Provider = null;
    }
  }

  @action
  async loadWeb3(provider = null) {
    /*
    Handles loading web3 provider.
    Injected web3 loaded and active if chain Id matches.
    Backup web3 loaded and active if no injected or injected chain Id not correct.
    */
    const windowEthereum = window.ethereum || window.BinanceChain;
    if (provider === null && windowEthereum) {
      console.log(`[Provider] Loading Injected Provider`);
      await this.loadProvider(windowEthereum);
    } else if (provider) {
      console.log(`[Provider] Loading Provider`);
      await this.loadProvider(provider);
    }

    // If no injected provider or inject provider is wrong chain fall back to Infura
    if (
      !this.providerStatus.injectedLoaded ||
      !networkConnectors.isChainIdSupported(this.providerStatus.injectedChainId)
    ) {
      console.log(
        `[Provider] Reverting To Backup Provider.`,
        this.providerStatus
      );
      try {
        const networkUrl = networkConnectors.getBackupUrl();
        const web3 = new ethers.providers.JsonRpcProvider(networkUrl);
        let network = await web3.getNetwork();
        this.providerStatus.injectedActive = false;
        this.providerStatus.backUpLoaded = true;
        this.setActiveChainId(network.chainId);
        this.setAccount(null);
        this.providerStatus.backUpWeb3 = web3;
        this.providerStatus.library = web3;
        this.providerStatus.activeProvider = 'backup';
        const provider = new MiniRpcProvider(network.chainId, networkUrl);
        const web3Provider = new Web3Provider(
          provider as ExternalProvider,
          'any'
        );
        web3Provider.pollingInterval = 15000;
        this.providerStatus.web3Provider = web3Provider;
        console.log(`[Provider] BackUp Provider Loaded & Active`);
      } catch (err) {
        console.error(`[Provider] loadWeb3 BackUp Error`, err);
        this.providerStatus.injectedActive = false;
        this.providerStatus.backUpLoaded = false;
        this.setActiveChainId(-1);
        this.setAccount(null);
        this.providerStatus.backUpWeb3 = null;
        this.providerStatus.library = null;
        this.providerStatus.active = true; // false;
        this.providerStatus.error = new Error(ERRORS.NoWeb3);
        this.providerStatus.activeProvider = null;
        this.providerStatus.web3Provider = null;
        return;
      }
    } else {
      console.log(`[Provider] Injected provider active.`);
      this.providerStatus.library = this.providerStatus.injectedWeb3;
      this.setActiveChainId(this.providerStatus.injectedChainId);
      // Only fetch if not first page load as could be change of provider
      this.providerStatus.injectedActive = true;
    }

    this.providerStatus.active = true;
    this.initializedProvider = true;
    console.log(`[Provider] Provider Active.`, this.providerStatus);
  }
}
