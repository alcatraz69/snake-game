import React from 'react';
import './styles.css';

const Cell = ({ head, body, tail, x, y, pellet }) => {
  if (x === head.x && y === head.y) {
    return (
      <div className="cell">
        <span className="cell--inner cell--inner__head" />
      </div>
    );
  }
  if (body.some((b) => b.x === x && b.y === y)) {
    return (
      <div className="cell">
        <span className="cell--inner cell--inner__body" />
      </div>
    );
  }
  if (x === tail.x && y === tail.y) {
    return (
      <div className="cell">
        <span className="cell--inner cell--inner__tail" />
      </div>
    );
  }
  if (x === pellet.x && y === pellet.y) {
    return (
      <div className="cell">
        <span className="cell--inner cell--inner__pellet" />
      </div>
    );
  }
  return <div className="cell" />;
};

export default Cell;
