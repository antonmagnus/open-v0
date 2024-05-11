/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, DependencyList } from 'react';

function useDelayEffect(effect: () => void, deps: DependencyList, delay: number) {
  useEffect(() => {
    const timeout = setTimeout(effect, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, deps);
}

export default useDelayEffect;
