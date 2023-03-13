import { useEffect, useState, useCallback } from 'react';

function useKeyPress(targetKeys) {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = useCallback(({ key }) => {
    if (targetKeys.includes(key)) {
      setKeyPressed(key);
    }
  },[targetKeys])


  const upHandler = useCallback(({ key }) => {
    if (targetKeys.includes(key)) {
      setKeyPressed(false);
    }
  },[targetKeys]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler,upHandler]);

  return keyPressed;
}

export default useKeyPress;
