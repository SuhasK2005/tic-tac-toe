import "./TicTacToe.css";
import circle from "../assets/circle.png";
import cross from "../assets/cross.png";
import { useEffect, useState, useRef } from "react";

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Returns {winner: 'X'|'O', line: [i,j,k]} or null
const findWinningLine = (board) => {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const boardRef = useRef(null);
  const cellRefs = useRef([]);
  const [lineCoords, setLineCoords] = useState(null);

  // keyboard shortcuts on the window: 1-9 to place, R to reset board
  useEffect(() => {
    const handler = (e) => {
      const k = e.key;
      if (/^[1-9]$/.test(k)) {
        const idx = parseInt(k, 10) - 1;
        if (board[idx] || winner || isDraw) return;
        const next = board.slice();
        next[idx] = current;
        setBoard(next);
        setCurrent((p) => (p === "X" ? "O" : "X"));
      } else if (k === "r" || k === "R") {
        resetGame();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [board, current, winner, isDraw]);

  useEffect(() => {
    const win = findWinningLine(board);
    if (win) {
      setWinner(win.winner);
      setWinningLine(win.line);
      return;
    }
    if (board.every((cell) => cell !== null)) {
      setIsDraw(true);
    } else {
      setIsDraw(false);
    }
  }, [board]);

  // compute overlay line coordinates for the winning line
  useEffect(() => {
    const compute = () => {
      if (!winningLine || !boardRef.current) return setLineCoords(null);
      const rectBoard = boardRef.current.getBoundingClientRect();
      const [startIdx, , endIdx] = winningLine; // use first and last
      const startEl = cellRefs.current[startIdx];
      const endEl = cellRefs.current[endIdx];
      if (!startEl || !endEl) return setLineCoords(null);
      const r1 = startEl.getBoundingClientRect();
      const r2 = endEl.getBoundingClientRect();
      const x1 = r1.left + r1.width / 2 - rectBoard.left;
      const y1 = r1.top + r1.height / 2 - rectBoard.top;
      const x2 = r2.left + r2.width / 2 - rectBoard.left;
      const y2 = r2.top + r2.height / 2 - rectBoard.top;
      setLineCoords({
        x1,
        y1,
        x2,
        y2,
        w: rectBoard.width,
        h: rectBoard.height,
      });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [winningLine]);

  const handleClick = (index) => {
    if (board[index] || winner || isDraw) return;
    const next = board.slice();
    next[index] = current;
    setBoard(next);
    setCurrent((p) => (p === "X" ? "O" : "X"));
  };

  const resetGame = () => {
    // reset board only (start new round)
    setBoard(Array(9).fill(null));
    setCurrent("X");
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
  };

  const resetAll = () => {
    // kept for compatibility but simply reset the board
    resetGame();
  };

  const renderCell = (value, idx) => {
    const isWinningCell = winningLine?.includes(idx);
    return (
      <button
        key={idx}
        ref={(el) => (cellRefs.current[idx] = el)}
        className={`boxes ${value ? "filled" : ""} ${
          isWinningCell ? "win" : ""
        }`}
        onClick={() => handleClick(idx)}
        disabled={!!value || !!winner || isDraw}
        aria-label={`cell-${idx}`}
      >
        {value === "X" && <img src={cross} alt="X" />}
        {value === "O" && <img src={circle} alt="O" />}
      </button>
    );
  };

  return (
    <div className="container">
      <h1 className="title">
        Tic Tac Toe <span>Game</span>
      </h1>

      <div className="top-row">
        <div className="status">
          <p>Turn: {current}</p>
        </div>
      </div>

      <div
        className="board"
        ref={boardRef}
        role="grid"
        aria-label="Tic tac toe board"
      >
        {Array.from({ length: 9 }).map((_, idx) => renderCell(board[idx], idx))}

        {/* svg overlay for winning line */}
        {lineCoords && (
          <svg
            className="win-overlay"
            viewBox={`0 0 ${lineCoords.w} ${lineCoords.h}`}
            preserveAspectRatio="none"
          >
            <line
              className="win-line"
              x1={lineCoords.x1}
              y1={lineCoords.y1}
              x2={lineCoords.x2}
              y2={lineCoords.y2}
            />
          </svg>
        )}
      </div>

      <div className="controls">
        <button
          className="reset primary"
          onClick={resetAll}
          title="Reset board"
        >
          Reset Board
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
