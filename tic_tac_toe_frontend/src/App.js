import React, { useState } from 'react';
import './App.css';

// Color constants for theme (provided in requirements)
const ACCENT = "#e63946";
const PRIMARY = "#008CBA";
const SECONDARY = "#f2f2f2";

// Board size constant
const SIZE = 3;

/*
  PUBLIC_INTERFACE
  Main App component: Implements the entire Tic Tac Toe game UI and logic
*/
function App() {
  // Board state: Array(9). Values: 'X', 'O', or null
  const [board, setBoard] = useState(Array(SIZE * SIZE).fill(null));
  // True: X's turn, False: O's turn
  const [isXTurn, setIsXTurn] = useState(true);
  // Game status: 'playing' | 'draw' | 'won'
  const [status, setStatus] = useState('playing');
  // Winning line (for highlight)
  const [winningLine, setWinningLine] = useState([]);

  // PUBLIC_INTERFACE
  // Handles a player click on the board
  function handleCellClick(idx) {
    if (board[idx] !== null || status !== 'playing') return;
    const newBoard = board.slice();
    newBoard[idx] = isXTurn ? 'X' : 'O';

    const res = calculateWinner(newBoard);

    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    if (res.winner) {
      setStatus('won');
      setWinningLine(res.line);
    } else if (newBoard.every(cell => cell !== null)) {
      setStatus('draw');
    }
  }

  // PUBLIC_INTERFACE
  // Reset the game to its initial state
  function resetGame() {
    setBoard(Array(SIZE * SIZE).fill(null));
    setIsXTurn(true);
    setStatus('playing');
    setWinningLine([]);
  }

  // PUBLIC_INTERFACE
  // Compute the status message to show above the board
  function getStatusMessage() {
    if (status === 'won') {
      const winner = isXTurn ? 'O' : 'X';
      return (
        <span>
          <span className="winner">{winner}</span> wins!
        </span>
      );
    } else if (status === 'draw') {
      return <span>It's a <span className="draw">draw</span>!</span>;
    } else {
      return (
        <span>
          Next turn: <span className={isXTurn ? 'playerX' : 'playerO'}>
            {isXTurn ? "X" : "O"}
          </span>
        </span>
      );
    }
  }

  // Generate the game board as a grid of cells
  function renderBoard() {
    return (
      <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
        {Array(SIZE).fill(null).map((_, rowIdx) =>
          <div className="ttt-row" key={rowIdx} role="row">
            {Array(SIZE).fill(null).map((_, colIdx) => {
              const idx = rowIdx * SIZE + colIdx;
              const isWinner = winningLine.includes(idx);
              return (
                <button
                  key={colIdx}
                  className={`ttt-cell${isWinner ? " winner-cell" : ""}`}
                  onClick={() => handleCellClick(idx)}
                  disabled={board[idx] !== null || status !== 'playing'}
                  aria-label={`Cell ${rowIdx + 1}, ${colIdx + 1}: ${board[idx] || 'Empty'}`}
                  tabIndex={0}
                >
                  {board[idx]}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="ttt-app"
      style={{
        background: SECONDARY,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <main className="ttt-main">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-player-indicator">
          {getStatusMessage()}
        </div>
        {renderBoard()}
        <button
          className="ttt-reset-btn"
          onClick={resetGame}
          aria-label="Reset the game"
        >
          Reset Game
        </button>
        <footer className="ttt-footer">
          <span>
            Minimal UI &mdash; <span style={{ color: ACCENT }}>React</span> {new Date().getFullYear()}
          </span>
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Determines if there is a winner.
 * Returns {winner: 'X'|'O'|null, line: [idx]} if a winning line is found.
 */
function calculateWinner(board) {
  const lines = [
    // Rows
    [0,1,2], [3,4,5], [6,7,8],
    // Columns
    [0,3,6], [1,4,7], [2,5,8],
    // Diags
    [0,4,8], [2,4,6],
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: [] };
}

export default App;
