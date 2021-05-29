import { action, computed, observable } from 'mobx';
import RootStore from 'stores/Root';
import { chiGasToken } from '../configs/addresses';
import MobxLocalStorage from '../utils/mobxLocalStorage';
import { INITIAL_ALLOWED_SLIPPAGE } from '../constants';
import { bnum, isDevEnv } from '../utils/helpers';
import BigNumber from 'bignumber.js';

export default class AppSettingsStore {
  @observable darkMode: boolean;
  @observable settingsMenu: boolean;
  @observable expertMode: boolean;
  @observable enabledChiGasToken: boolean;
  @observable loadingChiGasToken: boolean;
  @observable slippageTolerancePercent: number;
  @observable txDeadline: number; // seconds
  isDeveloper: boolean;
  rootStore: RootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.darkMode = true;
    this.settingsMenu = false;
    this.expertMode = false;
    this.enabledChiGasToken = false;
    this.loadingChiGasToken = false;
    this.slippageTolerancePercent = INITIAL_ALLOWED_SLIPPAGE;
    this.txDeadline = 1200;
    this.isDeveloper = isDevEnv();

    MobxLocalStorage.autorun(this, 'settings', [
      'slippageTolerancePercent',
      'txDeadline',
    ]);
  }

  @computed get userSlippageTolerance(): number {
    return bnum(this.slippageTolerancePercent)
      .div(100)
      .toNumber();
  }

  calcSlippageAmount = (value: any, decimals?: number): BigNumber => {
    const ratio = bnum(100)
      .minus(this.slippageTolerancePercent)
      .div(100);
    return bnum(value)
      .multipliedBy(ratio)
      .decimalPlaces(decimals ?? 18, BigNumber.ROUND_DOWN);
  };

  getChiConfig() {
    const chiConfig = window.localStorage.getItem('chiGastoken');
    try {
      return chiConfig ? JSON.parse(chiConfig) : null;
    } catch (e) {
      return null;
    }
  }

  initChiSettings = () => {
    const { tokenStore, providerStore } = this.rootStore;
    const { account } = providerStore.providerStatus;
    if (window) {
      const chiConfig = this.getChiConfig();
      let enabled = false;
      try {
        if (
          chiConfig === 1 ||
          (Array.isArray(chiConfig) &&
            chiConfig.find(v => v.toLowerCase() === account.toLowerCase()))
        ) {
          enabled = true;
        }
      } catch (e) {}
      console.log(
        'initChiSettings___',
        enabled,
        tokenStore.isChiApprovedForExchangeProxy
      );
      if (enabled && tokenStore.isChiApprovedForExchangeProxy) {
        this.enabledChiGasToken = true;
      } else if (account) {
        this.enabledChiGasToken = false;
      }
    }
  };

  @action toggleDarkMode = () => {
    this.darkMode = !this.darkMode;
  };

  @action setDarkMode = (visible: boolean) => {
    this.darkMode = visible;
  };

  @action toggleSettingsMenu = () => {
    this.settingsMenu = !this.settingsMenu;
  };

  @action toggleExportMode = () => {
    this.expertMode = !this.expertMode;
  };

  @action toggleEnabledChiGasToken = async () => {
    const { tokenStore, contractMetadataStore, providerStore } = this.rootStore;
    const { account } = providerStore.providerStatus;
    this.loadingChiGasToken = true;
    if (!this.enabledChiGasToken) {
      if (!tokenStore.isChiApprovedForExchangeProxy) {
        await new Promise((resolve, reject) => {
          tokenStore.approveMax(
            chiGasToken.address,
            contractMetadataStore.getRouterAddress(),
            (err, data) => {
              if (err) {
                this.loadingChiGasToken = false;
                return reject(err);
              }
              tokenStore.fetchBalancerChiGasTokenData();
              resolve(data);
            }
          );
        });
      }
    }
    console.log('enableChi.before___', this.enabledChiGasToken);
    this.enabledChiGasToken = !this.enabledChiGasToken;
    let chiConfig = this.getChiConfig();
    try {
      if (Array.isArray(chiConfig)) {
        chiConfig = chiConfig.filter(
          v => v.toLowerCase() !== account.toLowerCase()
        );
        if (this.enabledChiGasToken) {
          chiConfig.push(account);
        }
      } else {
        chiConfig = this.enabledChiGasToken ? [account] : [];
      }
    } catch (e) {
      console.error(e);
    }
    window.localStorage.setItem('chiGastoken', JSON.stringify(chiConfig));
    this.loadingChiGasToken = false;
  };

  saveAppSetting = (key, value) => {
    try {
      const data = window.localStorage.getItem('liquid_settings');
      const obj = data ? JSON.parse(data) : {};
      obj[key] = value;
      window.localStorage.setItem('liquid_settings', JSON.stringify(obj));
    } catch (e) {}
  };

  readAppSetting = key => {
    try {
      const data = window.localStorage.getItem('liquid_settings');
      const obj = data ? JSON.parse(data) : {};
      return obj[key];
    } catch (e) {}
  };

  @action setTxDeadline = (value: number | string) => {
    this.txDeadline = typeof value === 'string' ? parseFloat(value) : value;
  };

  @action setUserSlippageTolerance = (value: number) => {
    this.slippageTolerancePercent = value;
  };

  getTxDeadlineTime = (): number => {
    return this.txDeadline + Math.ceil(Date.now() / 1000);
  };
}
