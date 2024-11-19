import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';
import GameMenu from '../common/GameMenu';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${theme.colors.background.primary};
  padding: 2rem;
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: ${theme.colors.gradients.card};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.large};
  backdrop-filter: blur(8px);
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.text.primary};
  gap: 1rem;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const GameStatus = styled.div<{ isGameOver?: boolean }>`
  color: ${props => props.isGameOver ? theme.colors.error : theme.colors.text.primary};
  font-weight: ${props => props.isGameOver ? 'bold' : 'normal'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GameBoard = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 40px);
  grid-template-rows: repeat(${props => props.size}, 40px);
  gap: 2px;
  background: ${theme.colors.background.secondary};
  padding: 1rem;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.medium};
`;

const Cell = styled.button<{ revealed: boolean; isMine?: boolean; isFlagged?: boolean }>`
  width: 40px;
  height: 40px;
  border: none;
  background: ${props => props.revealed 
    ? theme.colors.background.secondary 
    : theme.colors.gradients.primary};
  color: ${theme.colors.text.primary};
  font-weight: bold;
  border-radius: ${theme.borderRadius.small};
  cursor: pointer;
  transition: ${theme.transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;

  &:hover {
    transform: ${props => !props.revealed && 'scale(1.05)'};
    box-shadow: ${props => !props.revealed && theme.shadows.glow};
  }

  ${props => props.isFlagged && `
    &::before {
      content: '🚩';
    }
  `}

  ${props => props.revealed && props.isMine && `
    background: ${theme.colors.error};
    box-shadow: 0 0 10px ${theme.colors.error};
    &::before {
      content: '💣';
    }
  `}
`;

const Button = styled.button`
  background: ${theme.colors.gradients.primary};
  color: ${theme.colors.text.primary};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${theme.typography.body.fontSize};
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.medium};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const InfoText = styled.span`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.body.fontSize};
`;

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface CellData {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const DIFFICULTY_SETTINGS = {
  Easy: {
    size: 8,
    mines: 10
  },
  Medium: {
    size: 12,
    mines: 30
  },
  Hard: {
    size: 16,
    mines: 60
  }
};

const Minesweeper: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [board, setBoard] = useState<CellData[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [showMenu, setShowMenu] = useState(true);
  const [firstClick, setFirstClick] = useState(true);

  const createBoard = useCallback((size: number): CellData[][] => {
    return Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
  }, []);

  const placeMines = useCallback((board: CellData[][], mines: number, firstX: number, firstY: number) => {
    const size = board.length;
    let minesPlaced = 0;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);

      // Don't place mine on first click or adjacent cells
      if (!newBoard[y][x].isMine && 
          (Math.abs(x - firstX) > 1 || Math.abs(y - firstY) > 1)) {
        newBoard[y][x].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!newBoard[y][x].isMine) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < size && nx >= 0 && nx < size && newBoard[ny][nx].isMine) {
                count++;
              }
            }
          }
          newBoard[y][x].neighborMines = count;
        }
      }
    }

    return newBoard;
  }, []);

  const startGame = (selectedDifficulty: Difficulty) => {
    const settings = DIFFICULTY_SETTINGS[selectedDifficulty];
    const newBoard = createBoard(settings.size);
    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setFlagCount(0);
    setFirstClick(true);
    setShowMenu(false);
    setDifficulty(selectedDifficulty);
  };

  const showGameMenu = () => {
    setShowMenu(true);
  };

  const revealCell = (x: number, y: number) => {
    if (gameOver || gameWon || board[y][x].isFlagged) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (firstClick) {
      const settings = DIFFICULTY_SETTINGS[difficulty];
      const boardWithMines = placeMines(newBoard, settings.mines, x, y);
      setBoard(boardWithMines);
      setFirstClick(false);
      newBoard[y][x].isRevealed = true;
      floodFill(boardWithMines, x, y);
      return;
    }

    if (newBoard[y][x].isMine) {
      // Game Over - reveal all mines
      newBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      }));
      setGameOver(true);
    } else {
      floodFill(newBoard, x, y);
    }

    setBoard(newBoard);
    if (!newBoard[y][x].isMine) {
      checkWinCondition(newBoard);
    }
  };

  const floodFill = (board: CellData[][], x: number, y: number) => {
    const size = board.length;
    if (x < 0 || x >= size || y < 0 || y >= size || 
        board[y][x].isRevealed || board[y][x].isFlagged) return;

    board[y][x].isRevealed = true;

    if (board[y][x].neighborMines === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          floodFill(board, x + dx, y + dy);
        }
      }
    }
  };

  const toggleFlag = (x: number, y: number) => {
    if (gameOver || gameWon || board[y][x].isRevealed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[y][x].isFlagged = !newBoard[y][x].isFlagged;
    setBoard(newBoard);
    setFlagCount(prev => prev + (newBoard[y][x].isFlagged ? 1 : -1));
  };

  const checkWinCondition = (board: CellData[][]) => {
    const allNonMinesRevealed = board.every(row =>
      row.every(cell => cell.isMine || cell.isRevealed)
    );
    if (allNonMinesRevealed) {
      setGameWon(true);
    }
  };

  const handleExit = () => {
    navigate('/');
  };

  const handleCellClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (e.button === 0) { // Left click
      revealCell(x, y);
    } else if (e.button === 2) { // Right click
      toggleFlag(x, y);
    }
  };

  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <GameContainer>
      {showMenu ? (
        <GameMenu
          isVisible={true}
          gameTitle="Minesweeper"
          onStart={() => startGame(difficulty)}
          onHome={handleExit}
          showDifficulty={true}
          difficulty={difficulty}
          onDifficultyChange={(newDifficulty) => setDifficulty(newDifficulty as Difficulty)}
        />
      ) : (
        <GameArea>
          <GameHeader>
            <GameStatus isGameOver={gameOver}>
              {gameOver ? '💣 Game Over!' : gameWon ? '🎉 You Won!' : `🚩 Flags: ${flagCount}`}
            </GameStatus>
            <HeaderControls>
              <Button onClick={showGameMenu}>New Game</Button>
              <Button onClick={handleExit}>Exit</Button>
            </HeaderControls>
          </GameHeader>
          <GameBoard size={DIFFICULTY_SETTINGS[difficulty].size}>
            {board.map((row, y) =>
              row.map((cell, x) => (
                <Cell
                  key={`${x}-${y}`}
                  revealed={cell.isRevealed}
                  isMine={cell.isMine}
                  isFlagged={cell.isFlagged}
                  onClick={(e) => handleCellClick(e, x, y)}
                  onContextMenu={(e) => handleCellClick(e, x, y)}
                >
                  {cell.isRevealed && !cell.isMine && cell.neighborMines > 0
                    ? cell.neighborMines
                    : ''}
                </Cell>
              ))
            )}
          </GameBoard>
        </GameArea>
      )}
    </GameContainer>
  );
};

export default Minesweeper;
