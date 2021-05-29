// Stores
import { web3Window as window } from '../provider/Web3Window';

import DropdownStore from './Dropdown';
import ErrorStore from './Error';
import ProviderStore from './Provider'
import MulticallStore from './MulticallStore';

export default class RootStore {
  providerStore: ProviderStore;
  errorStore: ErrorStore;
  dropdownStore: DropdownStore;
  multicallStore: MulticallStore;

  constructor() {
    this.dropdownStore = new DropdownStore(this);
    this.errorStore = new ErrorStore(this);
    this.providerStore = new ProviderStore(this)
    this.multicallStore = new MulticallStore(this)
    this.asyncSetup().catch(e => {
      //TODO: Add retry on these fetches
      throw new Error('Async Setup Failed ' + e);
    });
  }

  async asyncSetup() {
    const windowEthereum = window.ethereum || window.BinanceChain;
    if (!windowEthereum) {
      await new Promise(resolve => {
        setTimeout(resolve, 500);
      });
    }
    await this.providerStore.loadWeb3();
    // Load on-chain data as soon as a provider is available
  }
}
