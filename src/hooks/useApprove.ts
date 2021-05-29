import { useCallback, useMemo, useState } from 'react';
import { useStores } from '../contexts/storesContext';
import { EtherKey, TokenMetadata } from '../stores/Token';
import {
  useTokenAllowance,
  useTokenAllowances,
} from '../state/tokenLists/hooks';
import { bnum, isAddressEqual } from '../utils/helpers';

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

export function isShowApproval(approvalState: ApprovalState) {
  return (
    [
      ApprovalState.UNKNOWN,
      ApprovalState.PENDING,
      ApprovalState.NOT_APPROVED,
    ].indexOf(approvalState) >= 0
  );
}

export function isDisabledApproval(approvalState: ApprovalState) {
  return (
    [ApprovalState.UNKNOWN, ApprovalState.PENDING].indexOf(approvalState) >= 0
  );
}

export function areForApproval(approvalState: ApprovalState) {
  return approvalState === ApprovalState.PENDING;
}

export function useApproveCallback(
  token: TokenMetadata,
  spender?: string,
  amountToApprove?: string | number
): [ApprovalState, () => Promise<void>] {
  const {
    root: { providerStore, tokenStore },
  } = useStores();
  const { account } = providerStore.providerStatus;
  const { approveMaxCallback } = tokenStore;

  const [areApproved, setApproved] = useState<boolean>(false);

  const currentAllowance = useTokenAllowance(token.address, account, spender);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!token || !token.address) return ApprovalState.UNKNOWN;
    if (
      token.address === EtherKey ||
      !spender ||
      isAddressEqual(token.address, spender)
    )
      return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lt(bnum(amountToApprove || 1))
      ? areApproved
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [token, amountToApprove, currentAllowance, spender, areApproved]);

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    if (!token?.address) {
      console.error('no token');
      return;
    }
    if (!spender) {
      console.error('no spender');
      return;
    }

    setApproved(true);
    try {
      await approveMaxCallback(token.address, spender);
    } catch (e) {}
    setApproved(false);
  }, [approveMaxCallback, token, spender, approvalState]);

  return [approvalState, approve];
}

export function useMultipleApprovalCallback(
  tokens: TokenMetadata[],
  spender?: string,
  amountsToApprove?: (string | number)[]
): {
  approvalState: ApprovalState;
  needApprovalNumber?: number;
  needApprovalTokens?: TokenMetadata[];
  onMultipleApproval: () => Promise<void>;
} {
  const {
    root: { providerStore, tokenStore },
  } = useStores();
  const { account } = providerStore.providerStatus;
  const { approveMaxCallback } = tokenStore;

  const [areApproved, setApproved] = useState<boolean>(false);

  const currentAllowances = useTokenAllowances(
    tokens.map(t => t.address),
    account,
    spender
  );

  // check the current approval status
  const approvalState: {
    state: ApprovalState;
    needApprovalNumber?: number;
    needApprovalTokens?: TokenMetadata[];
  } = useMemo(() => {
    const needApprovalTokens: TokenMetadata[] = [];
    let needApprovalNumber: number = 0;

    const states = tokens.map((token: TokenMetadata, index: number) => {
      if (!token || !token.address || !spender) return ApprovalState.UNKNOWN;
      if (token.address === EtherKey) return ApprovalState.APPROVED;
      const currentAllowance = currentAllowances[index];
      // we might not have enough data to know whether or not we need to approve
      if (!currentAllowance) return ApprovalState.UNKNOWN;

      // amountToApprove will be defined if currentAllowance is
      const amountToApprove = amountsToApprove
        ? amountsToApprove[index]
        : undefined;
      if (currentAllowance.lt(bnum(amountToApprove || 1))) {
        needApprovalNumber += 1;
        needApprovalTokens.push(token);
        return areApproved ? ApprovalState.PENDING : ApprovalState.NOT_APPROVED;
      }
      return ApprovalState.APPROVED;
    });

    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      if (state === ApprovalState.UNKNOWN) {
        return { state: ApprovalState.UNKNOWN, needApprovalNumber };
      }
      if (state === ApprovalState.PENDING) {
        return { state: ApprovalState.PENDING, needApprovalNumber };
      }
      // not_approved | approved
    }
    return {
      state:
        needApprovalNumber > 0
          ? ApprovalState.NOT_APPROVED
          : ApprovalState.APPROVED,
      needApprovalNumber,
      needApprovalTokens,
    };
  }, [tokens, amountsToApprove, currentAllowances, spender, areApproved]);

  const approve = useCallback(async (): Promise<void> => {
    const needApprovalTokens = Array.isArray(approvalState.needApprovalTokens)
      ? approvalState.needApprovalTokens
      : [];
    if (needApprovalTokens.length) {
      const promises = needApprovalTokens.map(token => {
        if (!token?.address) {
          console.error('no token');
          return Promise.resolve();
        }
        if (!spender) {
          console.error('no spender');
          return Promise.resolve();
        }
        return approveMaxCallback(token.address, spender);
      });

      setApproved(true);
      try {
        await Promise.all(promises);
      } catch (e) {}
      setApproved(false);
    }
  }, [approveMaxCallback, spender, approvalState]);

  return {
    approvalState: approvalState.state,
    needApprovalNumber: approvalState.needApprovalNumber,
    needApprovalTokens: approvalState.needApprovalTokens,
    onMultipleApproval: approve,
  };
}
