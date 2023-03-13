import { useEffect, useState } from 'react';

function useKeyPress(targetKeys) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (targetKeys.includes(key)) {
      setKeyPressed(key);
    }
  }

  const upHandler = ({ key }) => {
    if (targetKeys.includes(key)) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
}

export default useKeyPress;
