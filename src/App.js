import { useState } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #F5F2ED;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
  }

  .game-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    padding: 48px 32px;
  }

  .game-header {
    text-align: center;
  }

  .game-title {
    font-family: 'DM Mono', monospace;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #9B9589;
  }

  .game-status {
    font-family: 'DM Mono', monospace;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.08em;
    color: #2D2926;
    margin-top: 14px;
    min-height: 20px;
    transition: opacity 0.3s ease;
  }

  .game-status.winner {
    color: #2D2926;
    font-weight: 500;
  }

  /* Board */
  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    position: relative;
  }

  /* Grid lines drawn with pseudo-elements on the board container */
  .board::before,
  .board::after {
    content: '';
    position: absolute;
    background: #C8C2B8;
    pointer-events: none;
  }

  /* Two vertical lines */
  .board-lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .square {
    width: 96px;
    height: 96px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 28px;
    font-weight: 300;
    color: #2D2926;
    position: relative;
    transition: background 0.15s ease;
    outline: none;
  }

  .square:hover {
    background: rgba(45, 41, 38, 0.04);
  }

  .square:active {
    background: rgba(45, 41, 38, 0.08);
  }

  /* Dividers between squares */
  .square:nth-child(1),
  .square:nth-child(2),
  .square:nth-child(4),
  .square:nth-child(5),
  .square:nth-child(7),
  .square:nth-child(8) {
    border-right: 1px solid #C8C2B8;
  }

  .square:nth-child(1),
  .square:nth-child(2),
  .square:nth-child(3),
  .square:nth-child(4),
  .square:nth-child(5),
  .square:nth-child(6) {
    border-bottom: 1px solid #C8C2B8;
  }

  .square-x { color: #2D2926; }
  .square-o { color: #9B9589; }

  /* History */
  .history {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 288px;
    align-items: center;
  }

  .history-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #B0AA9F;
    margin-bottom: 4px;
  }

  .history-btn {
    background: none;
    border: 1px solid #DDD8D0;
    border-radius: 2px;
    padding: 7px 18px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    color: #7A7470;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: all 0.15s ease;
  }

  .history-btn:hover {
    border-color: #2D2926;
    color: #2D2926;
    background: rgba(45,41,38,0.03);
  }

  .history-btn.active {
    border-color: #2D2926;
    color: #2D2926;
    background: rgba(45,41,38,0.05);
  }

  .reset-btn {
    background: none;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #B0AA9F;
    cursor: pointer;
    padding: 4px 0;
    transition: color 0.15s ease;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: transparent;
  }
 
  .reset-btn:hover {
    color: #2D2926;
    text-decoration-color: #2D2926;
  }

`;

function Square({ value, onSquareClick }) {
  const cls = value === 'X' ? 'square square-x' : value === 'O' ? 'square square-o' : 'square';
  return (
    <button className={cls} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    onPlay(next);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  let statusText = '';
  let statusClass = 'game-status';

  if (winner) {
    statusText = `${winner} gana`;
    statusClass += ' winner';
  } else if (isDraw) {
    statusText = 'empate';
  } else {
    statusText = `turno de ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <p className={statusClass}>{statusText}</p>
      <div className="board">
        {squares.map((val, i) => (
          <Square key={i} value={val} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function resetGame() {
  setHistory([Array(9).fill(null)]);
  setCurrentMove(0);
}

  return (
    <>
      <style>{styles}</style>
      <div className="game-wrapper">
        <div className="game-header">
          <p className="game-title">Tic · Tac · Toe</p>
        </div>

        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <button onClick={resetGame} className='reset-btn'>
          Reiniciar
        </button>

        {history.length > 1 && (
          <div className="history">
            <p className="history-label">historial</p>
            {history.map((_, move) => (
              <button
                key={move}
                className={`history-btn ${move === currentMove ? 'active' : ''}`}
                onClick={() => jumpTo(move)}
              >
                {move === 0 ? 'inicio' : `jugada ${move}`}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}



function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
