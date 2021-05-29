import _ from 'lodash';
import { useCallback } from 'react';

export default function useThrottle(cb, delay) {
  return useCallback(_.throttle(cb, delay), []);
}
