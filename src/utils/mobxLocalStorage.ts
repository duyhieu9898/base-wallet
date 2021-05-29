import { extendObservable, toJS, autorun, observe } from 'mobx';
import _ from 'lodash';
import { ChainId } from '../constants';
import { networkConnectors } from '../provider/networkConnectors';

const prefixKey = 'mobx_localstorage_';

function readLocal(name) {
  try {
    const fromStorage = window.localStorage.getItem(prefixKey + name);
    return fromStorage ? JSON.parse(fromStorage) : null;
  } catch (e) {
    return null;
  }
}

function saveLocal(name, data) {
  window.localStorage.setItem(prefixKey + name, JSON.stringify(data));
}

const read = (
  _this: any,
  _name: string,
  withActiveChainId: boolean = false
): any | undefined => {
  try {
    let chainId: ChainId = undefined;
    if (withActiveChainId) {
      chainId =
        _this.rootStore?.providerStore.providerStatus.activeChainId ??
        networkConnectors.getDefaultChainId();
    }
    const existingStore = readLocal(_name);
    if (Object.keys(existingStore)) {
      let byChain = {};
      if (chainId) {
        byChain = existingStore[chainId] || {};
      }
      return byChain;
    }
  } catch (e) {}
  return undefined;
};

const load = (
  _this: any,
  _name: string,
  withActiveChainId: boolean = false
): void => {
  const data = read(_this, _name, withActiveChainId);
  if (data) {
    extendObservable(_this, data);
  }
};

const save = (
  _this: any,
  _name: string,
  _pick: string[],
  withActiveChainId: boolean = false
): void => {
  const handleSave = () => {
    let store = _.omit(_this, 'rootStore');
    let chainId: ChainId = undefined;
    if (withActiveChainId) {
      chainId =
        _this.rootStore?.providerStore.providerStatus.activeChainId ??
        networkConnectors.getDefaultChainId();
    }
    if (Array.isArray(_pick) && _pick.length > 0) {
      store = _.pick(store, _pick);
    }
    if (chainId) {
      try {
        let existingStore = readLocal(_name);
        if (Object.keys(existingStore)) {
          // refactor local store
          const keys = Object.keys(existingStore);
          for (let i = 0; i < keys.length; i++) {
            if (!(keys[i] in ChainId)) {
              existingStore = {};
              break;
            }
          }
          store = Object.assign({}, existingStore, { [chainId]: store });
        }
      } catch (e) {}
    }
    // from then on serialize and save to localStorage
    saveLocal(_name, toJS(store));
  };

  if (Array.isArray(_pick) && _pick.length > 0) {
    observe(_this, (change: any) => {
      if (_pick.indexOf(change.name) >= 0) {
        handleSave();
      }
    });
  } else {
    // will run on change
    autorun(() => {
      handleSave();
    });
  }
};

const loadAndSave = (
  _this: any,
  _name: string,
  pick?: string[],
  withActiveChainId?: boolean
) => {
  load(_this, _name, withActiveChainId);
  save(_this, _name, pick, withActiveChainId);
};

const MobxLocalStorage = {
  read,
  load,
  save,
  autorun: loadAndSave,
};

export default MobxLocalStorage;
