import { useState } from "react";
import "../styles.css";

const generate2dArray = (row = 0, col = 0, data = "") => {
  const arr = new Array(row).fill(data);

  for (let i = 0; i < col; i++) {
    arr[i] = new Array(col).fill(data);
  }

  return arr;
};

const Cell = ({ row, col, player }) => {
  return (
    <div className="cell" data-row={row} data-col={col}>
      {player}
    </div>
  );
};

const isValid = (boardState, row, col) => {
  if (
    row < 0 ||
    row >= boardState.length ||
    col < 0 ||
    col >= boardState[row].length
  )
    return false;

  return true;
};

const checkWinner = (boardState, row, col, setWinner) => {
  const x = [-1, -1, 0, 1, 1, 1, 0, -1];
  const y = [0, 1, 1, 1, 0, -1, -1, -1];

  let count = 1;

  for (let dir = 0; dir < x.length / 2; dir++) {
    let currRow = row + x[dir];
    let currCol = col + y[dir];

    while (
      isValid(boardState, currRow, currCol) &&
      boardState[row][col] === boardState[currRow][currCol]
    ) {
      console.log("first", { dir, currRow, currCol, count });
      count++;
      currRow += x[dir];
      currCol += y[dir];
    }

    currRow = row + x[dir + x.length / 2];
    currCol = col + y[dir + x.length / 2];

    while (
      isValid(boardState, currRow, currCol) &&
      boardState[row][col] === boardState[currRow][currCol]
    ) {
      console.log("second", { dir, currRow, currCol, count });
      count++;
      currRow += x[dir + x.length / 2];
      currCol += y[dir + x.length / 2];
    }

    if (count === boardState.length) setWinner(boardState[row][col]);

    count = 1;
  }
};

export default function Board({ size }) {
  const [boardState, setBoardState] = useState(generate2dArray(size, size));
  const [currPlayer, setCurrPlayer] = useState("X");
  const [winner, setWinner] = useState(null);

  const generateCell = () => {
    const board = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        board.push(
          <Cell
            key={`${row}${col}`}
            row={row}
            col={col}
            player={boardState[row][col]}
          />
        );
      }
    }

    return board;
  };

  const onCellContainerClick = (e) => {
    const currRow = parseInt(e.target.dataset.row, 10);
    const currCol = parseInt(e.target.dataset.col, 10);

    if (!winner && !Number.isInteger(currRow)) return;

    if (boardState[currRow][currCol].length > 0) {
      return boardState;
    }

    setBoardState((prevBoardState) => {
      prevBoardState[currRow][currCol] = currPlayer;
      checkWinner(prevBoardState, currRow, currCol, setWinner);
      return prevBoardState;
    });
    setCurrPlayer((prevPlayer) => (prevPlayer === "X" ? "O" : "X"));
  };

  const onResetClick = () => {
    setBoardState(generate2dArray(size, size));
    setCurrPlayer("X");
    setWinner();
  };

  return (
    <div className="board">
      <h1 className="top">Winner: {winner}</h1>
      <div className="mid">
        <h3>Current Player: {currPlayer}</h3>
        <button className="reset-button" type="reset" onClick={onResetClick}>
          Reset
        </button>
      </div>
      <div className="bottom">
        {!!winner && (
          <div>
            <h1 className="winner">Winner {winner}</h1>
          </div>
        )}
        <div className="cell-container" onClick={onCellContainerClick}>
          {generateCell()}
        </div>
      </div>
    </div>
  );
}
