import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #000000;
  font-family: 'Arial', sans-serif;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 8px;
  background-color: #1a1a1a;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
`;

const Cell = styled.button<{ isWinning?: boolean }>`
  width: 100px;
  height: 100px;
  background-color: ${({ isWinning }) => (isWinning ? '#ff69b440' : '#2a2a2a')};
  border: 2px solid ${({ isWinning }) => (isWinning ? '#ff69b4' : '#3a3a3a')};
  border-radius: 12px;
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff69b4;
  cursor: pointer;
  transition: all 0.2s;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);

  &:hover {
    background-color: #3a3a3a;
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 105, 180, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: ${({ isWinning }) => (isWinning ? 1 : 0.5)};
  }
`;

const Status = styled.div`
  font-size: 1.8rem;
  color: #ff69b4;
  margin: 1.5rem 0;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
`;

const Button = styled.button`
  background-color: #2a2a2a;
  color: #ff69b4;
  border: 2px solid #ff69b4;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.2rem;
  margin: 0.5rem;
  transition: all 0.2s;
  min-width: 200px;
  text-shadow: 0 0 5px rgba(255, 105, 180, 0.5);
  box-shadow: 0 0 10px rgba(255, 105, 180, 0.2);

  &:hover {
    background-color: #ff69b4;
    color: #ffffff;
    box-shadow: 0 0 20px rgba(255, 105, 180, 0.4);
  }
`;

const MenuOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1a1a1a;
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.3);
  border: 2px solid #ff69b4;
  min-width: 300px;
`;

const Title = styled.h2`
  color: #ff69b4;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const DifficultySelect = styled.select`
  padding: 0.8rem;
  border-radius: 25px;
  border: 2px solid #ff69b4;
  background-color: #2a2a2a;
  font-family: inherit;
  font-size: 1rem;
  color: #ff69b4;
  margin-top: 1rem;
  cursor: pointer;
  min-width: 200px;
  text-align: center;

  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(255, 105, 180, 0.4);
  }

  option {
    background-color: #1a1a1a;
  }
`;

type Player = 'X' | 'O' | null;
type Difficulty = 'easy' | 'medium' | 'hard';

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [gameMode, setGameMode] = useState<'pvp' | 'ai' | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isThinking, setIsThinking] = useState(false);
  const navigate = useNavigate();

  const calculateWinner = (squares: Player[]): number[] | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }
    return null;
  };

  const getEmptyCells = (squares: Player[]): number[] => {
    return squares.reduce((acc: number[], cell, index) => {
      if (!cell) acc.push(index);
      return acc;
    }, []);
  };

  const minimax = (
    squares: Player[],
    depth: number,
    isMaximizing: boolean,
    alpha: number = -Infinity,
    beta: number = Infinity
  ): { score: number; move?: number } => {
    const winner = calculateWinner(squares);
    if (winner) return { score: isMaximizing ? -10 + depth : 10 - depth };
    if (getEmptyCells(squares).length === 0) return { score: 0 };

    const emptyCells = getEmptyCells(squares);
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove: number | undefined;

    for (const move of emptyCells) {
      squares[move] = isMaximizing ? 'O' : 'X';
      const score = minimax(squares, depth + 1, !isMaximizing, alpha, beta).score;
      squares[move] = null;

      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
        beta = Math.min(beta, bestScore);
      }

      if (beta <= alpha) break;
    }

    return { score: bestScore, move: bestMove };
  };

  const getAIMove = (squares: Player[]): number => {
    const emptyCells = getEmptyCells(squares);
    
    // Easy: Random moves
    if (difficulty === 'easy') {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    // Medium: 70% optimal moves, 30% random moves
    if (difficulty === 'medium' && Math.random() > 0.7) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    // Hard/Medium: Use minimax for optimal moves
    return minimax(squares, 0, true).move ?? emptyCells[0];
  };

  const handleClick = async (i: number) => {
    if (board[i] || calculateWinner(board) || isThinking) return;

    const newBoard = board.slice();
    newBoard[i] = 'X';
    setBoard(newBoard);
    setXIsNext(false);

    const winner = calculateWinner(newBoard);
    if (winner) {
      setWinningCells(winner);
      return;
    }

    if (gameMode === 'ai' && !winner && getEmptyCells(newBoard).length > 0) {
      setIsThinking(true);
      // Add a small delay to make AI moves feel more natural
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const aiMove = getAIMove(newBoard);
      newBoard[aiMove] = 'O';
      setBoard(newBoard);
      setXIsNext(true);
      
      const aiWinner = calculateWinner(newBoard);
      if (aiWinner) {
        setWinningCells(aiWinner);
      }
      setIsThinking(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinningCells([]);
    setIsThinking(false);
  };

  const startGame = (mode: 'pvp' | 'ai') => {
    setGameMode(mode);
    setShowMenu(false);
    resetGame();
  };

  const handleExit = () => {
    navigate('/');
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);
  const status = isThinking
    ? "AI is thinking..."
    : winner
    ? `Winner: ${board[winner[0]]}`
    : isDraw
    ? "It's a Draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <GameContainer>
      {showMenu ? (
        <MenuOverlay>
          <Title>Tic Tac Toe</Title>
          <ButtonGroup>
            <Button onClick={() => startGame('pvp')}>Player vs Player</Button>
            <Button onClick={() => startGame('ai')}>Player vs AI</Button>
            {gameMode === 'ai' && (
              <DifficultySelect
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </DifficultySelect>
            )}
            <Button onClick={handleExit} style={{ backgroundColor: '#DC143C' }}>
              Exit to Menu
            </Button>
          </ButtonGroup>
        </MenuOverlay>
      ) : (
        <>
          <Status>{status}</Status>
          <GameBoard>
            {board.map((value, index) => (
              <Cell
                key={index}
                onClick={() => handleClick(index)}
                disabled={Boolean(value) || Boolean(winner) || isThinking}
                isWinning={winningCells.includes(index)}
              >
                {value}
              </Cell>
            ))}
          </GameBoard>
          <ButtonGroup>
            <Button onClick={resetGame}>New Game</Button>
            <Button onClick={() => setShowMenu(true)}>Main Menu</Button>
            <Button onClick={handleExit} style={{ backgroundColor: '#DC143C' }}>
              Exit to Menu
            </Button>
          </ButtonGroup>
        </>
      )}
    </GameContainer>
  );
};

export default TicTacToe;
