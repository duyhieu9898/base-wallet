import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { ChainId } from '../../constants';
import { useStores } from '../../contexts/storesContext';

const NetworkUpdater = observer((): null => {
  const { root: { providerStore } } = useStores();
  const { activeChainId } = providerStore.providerStatus;

  const [lastChainId, setLastChainId] = useState<ChainId>(undefined);

  useEffect(() => {
    if (activeChainId !== lastChainId) {
      setLastChainId(activeChainId);
    }
  }, [activeChainId, lastChainId]);

  return null;
});

export default NetworkUpdater;
