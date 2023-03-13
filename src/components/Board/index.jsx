import React, { useState, useEffect } from 'react';
import useKeyPress from './utils/useKeyPress';
import useInterval from './utils/useInterval';
import Cell from '../Cell/index';
import './styles.css';

const Board = () => {
  const [cellCount] = useState(30);
  const [duration] = useState(150);
  const [head, setHead] = useState({ x: 1, y: 10 });
  const [body, setBody] = useState([
    { x: 1, y: 11 },
    { x: 1, y: 12 },
  ]);
  const [tail, setTail] = useState({ x: 1, y: 13 });
  const [pellet, setPellet] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('up');
  const [pelletEaten, setPelletEaten] = useState(false);
  const [gameState, setGameState] = useState('paused'); // paused, started, finished
  const [changeDirection, setChangeDirection] = useState(false);
  const [score, setScore] = useState(0);

  const keyPressed = useKeyPress([
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ]);

  const moveBodyAndTail = () => {
    if (!pelletEaten) {
      setTail(body[body.length - 1]);
    } else {
      setPelletEaten(false);
    }
    const nBody = pelletEaten
      ? body
      : body.filter((x, y) => y !== body.length - 1);
    setBody([head, ...nBody]);
    setChangeDirection(false);
  };

  const cellIsInSnake = ({ x, y }) => {
    if (
      body.some((c) => c.x === x && c.y === y) ||
      (head.x === x && head.y === y) ||
      (tail.x === x && tail.y === x)
    )
      return true;
    return false;
  };

  const getRandomCell = () => {
    let x;
    let y;
    do {
      x = Math.floor(Math.random() * (cellCount - 1 - 0 + 1) + 0);
      y = Math.floor(Math.random() * (cellCount - 1 - 0 + 1) + 0);
    } while (cellIsInSnake({ x, y }));
    return {
      x,
      y,
    };
  };

  const checkAndSetHead = (h) => {
    if (
      body.some((b) => b.x === h.x && b.y === h.y) ||
      (h.x === tail.x && h.y === tail.y)
    ) {
      setGameState('finished');
    } else if (h.x === pellet.x && h.y === pellet.y) {
      setPelletEaten(true);
      setPellet(getRandomCell());
      setScore(score + 1);
    }
    setHead(h);
  };

  const moveSnake = () => {
    switch (direction) {
      case 'up':
        if (head.y === 0) {
          checkAndSetHead({ ...head, y: cellCount - 1 });
        } else {
          checkAndSetHead({ ...head, y: head.y - 1 });
        }
        break;
      case 'down':
        if (head.y === cellCount - 1) {
          checkAndSetHead({ ...head, y: 0 });
        } else {
          checkAndSetHead({ ...head, y: head.y + 1 });
        }
        break;
      case 'right':
        if (head.x === cellCount - 1) {
          checkAndSetHead({ ...head, x: 0 });
        } else {
          checkAndSetHead({ ...head, x: head.x + 1 });
        }
        break;
      case 'left':
        if (head.x === 0) {
          checkAndSetHead({ ...head, x: cellCount - 1 });
        } else {
          checkAndSetHead({ ...head, x: head.x - 1 });
        }
        break;
      default:
        break;
    }
    moveBodyAndTail();
  };

  const handleKeyDown = (key) => {
    if (!changeDirection) {
      setChangeDirection(true);
      switch (key) {
        case 'ArrowUp':
          if (direction !== 'down') {
            setDirection('up');
          }
          break;
        case 'ArrowDown':
          if (direction !== 'up') {
            setDirection('down');
          }
          break;
        case 'ArrowRight':
          if (direction !== 'left') {
            setDirection('right');
          }
          break;
        case 'ArrowLeft':
          if (direction !== 'right') {
            setDirection('left');
          }
          break;
        default:
          break;
      }
    }
  };

  const handleGameStateSwitch = () => {
    if (gameState === 'started') {
      setGameState('paused');
    } else if (gameState === 'finished') {
      setScore(0);
      setHead({ x: 1, y: 10 });
      setBody([
        { x: 1, y: 11 },
        { x: 1, y: 12 },
      ]);
      setTail({ x: 1, y: 13 });
      setDirection('up');
      setGameState('started');
    } else {
      setGameState('started');
    }
  };

  useEffect(() => {
    if (keyPressed) {
      handleKeyDown(keyPressed);
    }
  }, [keyPressed]);

  useInterval(
    () => {
      moveSnake();
    },
    gameState === 'started' ? duration : null
  );

  useInterval(
    () => {
      setPellet(getRandomCell());
    },
    gameState === 'started' ? duration * cellCount * 2 : null,
    pelletEaten
  );

  return (
    <div className="container">
      <div>
        <div className="board">
          {[...Array(cellCount).keys()].map((y) => (
            <div className="row" id={y} key={y}>
              {[...Array(cellCount).keys()].map((x) => (
                <Cell
                  head={head}
                  body={body}
                  tail={tail}
                  x={x}
                  y={y}
                  key={`${x}-${y}`}
                  pellet={pellet}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="score">
        <h3>Score : {score}</h3>
      </div>
      <div>
        <button
          type="button"
          className="start-button"
          onClick={() => handleGameStateSwitch()}
        >
          {gameState === 'started' ? 'Pause' : 'Start'}
        </button>
        {gameState === 'finished' && <h3>Game Over</h3>}
      </div>
    </div>
  );
};

export default Board;
