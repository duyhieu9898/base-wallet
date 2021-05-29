import { useCallback, useState } from 'react';

interface CurrencyModalState {
  open: boolean;
  name?: string;
}

export default function useCurrencyModal(): [
  CurrencyModalState,
  (open: boolean, name?: string) => void
] {
  const [state, setState] = useState<CurrencyModalState>({ open: false });
  const update = useCallback((open: boolean, name?: string) => {
    return setState(state => Object.assign({}, state, { open, name }));
  }, []);
  return [state, update];
}
