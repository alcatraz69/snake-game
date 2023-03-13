import { useEffect, useRef } from 'react';

function useInterval(callback, delay, refresh) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && !refresh) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, refresh]);
}

export default useInterval;
