import { observable, action } from 'mobx';
import RootStore from './Root';
import Errors from '../constants/errors.json';

export function makeUserFriendlyError(error?: string) {
  try {
    return error && Errors[error] ? Errors[error] : error;
  } catch (e) {}
}

interface Confirmation {
  type?: string;
  showConfirm: boolean;
  attemptingTxn: boolean;
  txHash?: string;
  errorMessage?: string;
  pendingText?: string;
  description?: string;
  confirmFor?: 'message' | 'transaction' | string;
}

class ConfirmationModal {
  rootStore: RootStore;
  @observable confirmation: Confirmation;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.confirmation = { showConfirm: false } as Confirmation;
  }

  @action update = (args: {
    type?: string;
    showConfirm?: boolean;
    attemptingTxn?: boolean;
    txHash?: string;
    errorMessage?: string;
    pendingText?: string;
    description?: string;
    confirmFor?: 'message' | 'transaction';
  }) => {
    this.confirmation = Object.assign({}, this.confirmation, {
      ...args,
      errorMessage: makeUserFriendlyError(args?.errorMessage),
    });
  };

  @action dismiss = () => {
    this.confirmation = {
      type: '',
      showConfirm: false,
      attemptingTxn: false,
      txHash: '',
      errorMessage: '',
      pendingText: '',
      confirmFor: '',
    };
  };
}

export default ConfirmationModal;
