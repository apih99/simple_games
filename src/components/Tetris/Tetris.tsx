import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AudioControls from '../common/AudioControls';
import GameMenu from '../common/GameMenu';
import { theme } from '../../styles/theme';

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
  flex-direction: row;
  gap: 2rem;
  padding: 2rem;
  background: ${theme.colors.gradients.card};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.large};
  backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(10, min(30px, 8vw));
  grid-template-rows: repeat(20, min(30px, 8vw));
  gap: 1px;
  background: ${theme.colors.background.secondary};
  padding: 1rem;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.medium};
  touch-action: none;
`;

const Cell = styled.div<{ color: string }>`
  width: min(30px, 8vw);
  height: min(30px, 8vw);
  background-color: ${({ color }) => color || theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.small};
  box-shadow: ${({ color }) =>
    color ? theme.shadows.small : 'none'};
  transition: ${theme.transitions.default};
`;

const NextPiece = styled.div`
  display: grid;
  grid-template-columns: repeat(4, min(30px, 8vw));
  grid-template-rows: repeat(4, min(30px, 8vw));
  gap: 1px;
  background: ${theme.colors.background.secondary};
  padding: 1rem;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 200px;
`;

const InfoPanel = styled.div`
  background: ${theme.colors.gradients.card};
  padding: 1.5rem;
  border-radius: ${theme.borderRadius.medium};
  text-align: center;
  color: ${theme.colors.text.primary};
  box-shadow: ${theme.shadows.medium};

  h3 {
    margin: 0 0 1rem 0;
    color: ${theme.colors.primary};
    font-size: ${theme.typography.subheading.fontSize};
    font-weight: ${theme.typography.subheading.fontWeight};
  }

  p {
    margin: 0.5rem 0;
    font-size: ${theme.typography.body.fontSize};
    color: ${theme.colors.text.secondary};
  }
`;

const Button = styled.button`
  background: ${theme.colors.gradients.primary};
  color: ${theme.colors.text.primary};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.body.fontSize};
  font-weight: 600;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.medium};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 100;
`;

const Controls = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1rem;
    width: 100%;
    max-width: 300px;
  }
`;

const ControlButton = styled.button`
  background: ${theme.colors.gradients.primary};
  color: ${theme.colors.text.primary};
  border: none;
  padding: 1rem;
  border-radius: ${theme.borderRadius.medium};
  font-size: 1.5rem;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
`;

const TETROMINOS = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: theme.colors.primary,
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: theme.colors.secondary,
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: theme.colors.primary,
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: theme.colors.secondary,
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: theme.colors.primary,
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: theme.colors.secondary,
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: theme.colors.primary,
  },
};

type TetrominoType = keyof typeof TETROMINOS;

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface GameState {
  board: string[][];
  piece: {
    type: TetrominoType;
    position: { x: number; y: number };
    shape: number[][];
  } | null;
  nextPiece: TetrominoType;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  difficulty: Difficulty;
  combo: number;
  backToBack: boolean;
}

const DIFFICULTY_SETTINGS = {
  Easy: {
    initialSpeed: 400,
    speedDecrease: 25,
    scoreMultiplier: 1.5
  },
  Medium: {
    initialSpeed: 250,
    speedDecrease: 35,
    scoreMultiplier: 2.5
  },
  Hard: {
    initialSpeed: 150,
    speedDecrease: 45,
    scoreMultiplier: 4
  }
};

const SCORE_TABLE = {
  softDrop: 2,
  hardDrop: 4,
  singleLine: 200,
  doubleLine: 600,
  tripleLine: 1200,
  tetris: 2000,
  tSpin: 800,
  combo: 100,
  backToBack: 2.0
};

const createEmptyBoard = (): string[][] => {
  return Array(20).fill(null).map(() => Array(10).fill(''));
};

const rotateMatrix = (matrix: number[][]): number[][] => {
  const N = matrix.length;
  const rotated = Array(N).fill(0).map(() => Array(N).fill(0));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      rotated[x][N - 1 - y] = matrix[y][x];
    }
  }
  return rotated;
};

const calculateSpeed = (level: number, difficulty: Difficulty): number => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const speed = settings.initialSpeed - (settings.speedDecrease * Math.pow(level, 1.2));
  return Math.max(50, speed);
};

const Tetris: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    piece: null,
    nextPiece: 'T',
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    difficulty: 'Medium',
    combo: 0,
    backToBack: false
  });
  const [isPaused, setIsPaused] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [swipeThreshold] = useState(30);

  const getRandomPiece = (): TetrominoType => {
    const pieces: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    return pieces[Math.floor(Math.random() * pieces.length)];
  };

  const createNewPiece = (type: TetrominoType) => ({
    type,
    position: { x: type === 'I' ? 3 : 4, y: 0 },
    shape: [...TETROMINOS[type].shape.map(row => [...row])]  // Deep copy the shape
  });

  const checkCollision = (
    piece: NonNullable<GameState['piece']>,
    board: string[][],
    offsetX = 0,
    offsetY = 0,
    rotatedShape?: number[][]
  ): boolean => {
    const shape = rotatedShape || piece.shape;
    if (!shape) return true;  // Safety check

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.position.x + x + offsetX;
          const newY = piece.position.y + y + offsetY;
          
          if (
            newX < 0 || 
            newX >= 10 || 
            newY >= 20 ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const mergePieceToBoard = (
    piece: NonNullable<GameState['piece']>,
    board: string[][]
  ): string[][] => {
    const newBoard = board.map(row => [...row]);
    const shape = piece.shape;
    const color = TETROMINOS[piece.type].color;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x <shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = color;
          }
        }
      }
    }
    return newBoard;
  };

  const clearLines = (board: string[][]): { newBoard: string[][], linesCleared: number } => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      const isLineFull = row.every(cell => cell !== '');
      if (isLineFull) linesCleared++;
      return !isLineFull;
    });

    while (newBoard.length < 20) {
      newBoard.unshift(Array(10).fill(''));
    }

    return { newBoard, linesCleared };
  };

  const movePiece = (offsetX: number, offsetY: number) => {
    if (!gameState.piece || gameState.gameOver || isPaused) return;

    if (!checkCollision(gameState.piece, gameState.board, offsetX, offsetY)) {
      setGameState(prev => ({
        ...prev,
        piece: {
          ...prev.piece!,
          position: {
            x: prev.piece!.position.x + offsetX,
            y: prev.piece!.position.y + offsetY
          }
        },
        score: offsetY > 0 ? prev.score + (SCORE_TABLE.softDrop * prev.level * DIFFICULTY_SETTINGS[prev.difficulty].scoreMultiplier) : prev.score
      }));
    } else if (offsetY > 0) {
      // Piece has landed
      const newBoard = mergePieceToBoard(gameState.piece, gameState.board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

      if (gameState.piece.position.y <= 0) {
        setGameState(prev => ({ ...prev, gameOver: true }));
        return;
      }

      const nextPiece = getRandomPiece();
      const multiplier = DIFFICULTY_SETTINGS[gameState.difficulty].scoreMultiplier;
      
      let scoreIncrease = 0;
      let isBackToBack = false;
      
      if (linesCleared > 0) {
        switch (linesCleared) {
          case 1:
            scoreIncrease = SCORE_TABLE.singleLine;
            break;
          case 2:
            scoreIncrease = SCORE_TABLE.doubleLine;
            break;
          case 3:
            scoreIncrease = SCORE_TABLE.tripleLine;
            break;
          case 4:
            scoreIncrease = SCORE_TABLE.tetris;
            isBackToBack = true;
            break;
        }

        const comboMultiplier = Math.min(gameState.combo + 1, 10);
        scoreIncrease += SCORE_TABLE.combo * comboMultiplier;

        if (isBackToBack && gameState.backToBack) {
          scoreIncrease *= SCORE_TABLE.backToBack;
        }

        scoreIncrease *= Math.pow(gameState.level, 1.5) * multiplier;
      }

      const newLevel = Math.floor((gameState.lines + linesCleared) / 8) + 1;

      setGameState(prev => ({
        ...prev,
        board: clearedBoard,
        piece: createNewPiece(prev.nextPiece),
        nextPiece,
        lines: prev.lines + linesCleared,
        score: prev.score + Math.floor(scoreIncrease),
        level: newLevel,
        combo: linesCleared > 0 ? prev.combo + 1 : 0,
        backToBack: isBackToBack
      }));
    }
  };

  const dropPiece = () => {
    if (!gameState.piece || gameState.gameOver || isPaused) return;
    
    let dropDistance = 0;
    while (!checkCollision(gameState.piece, gameState.board, 0, dropDistance + 1)) {
      dropDistance++;
    }
    
    const hardDropScore = dropDistance * SCORE_TABLE.hardDrop * gameState.level * DIFFICULTY_SETTINGS[gameState.difficulty].scoreMultiplier;
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + Math.floor(hardDropScore)
    }));
    
    movePiece(0, dropDistance);
  };

  const rotatePiece = useCallback(() => {
    if (!gameState.piece?.shape || gameState.gameOver || isPaused) return;  // Check for shape existence

    const piece = gameState.piece;
    const shape = [...piece.shape.map(row => [...row])];  // Deep copy current shape
    const rotated = rotateMatrix(shape);

    // Try rotation with different offsets (wall kicks)
    const offsets = [
      [0, 0],  // Normal rotation
      [-1, 0], // Left wall kick
      [1, 0],  // Right wall kick
      [0, -1], // Up kick
      [0, 1],  // Down kick
    ];

    for (const [offsetX, offsetY] of offsets) {
      if (!checkCollision(
        piece,
        gameState.board,
        offsetX,
        offsetY,
        rotated
      )) {
        setGameState(prev => ({
          ...prev,
          piece: {
            ...piece,
            position: {
              x: piece.position.x + offsetX,
              y: piece.position.y + offsetY
            },
            shape: rotated
          }
        }));
        return;
      }
    }
  }, [gameState.piece, gameState.board, gameState.gameOver, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState.gameOver || isPaused) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || gameState.gameOver || isPaused) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    if (Math.abs(deltaX) > swipeThreshold) {
      movePiece(deltaX > 0 ? 1 : -1, 0);
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
    
    if (deltaY > swipeThreshold) {
      movePiece(0, 1);
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const renderBoard = () => {
    const displayBoard = gameState.board.map(row => [...row]);
    
    if (gameState.piece && gameState.piece.shape) {  // Check for shape existence
      const { shape, position, type } = gameState.piece;
      const color = TETROMINOS[type].color;
      
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              displayBoard[boardY][boardX] = color;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => 
      row.map((color, x) => (
        <Cell key={`${y}-${x}`} color={color} />
      ))
    );
  };

  const renderNextPiece = () => {
    const shape = TETROMINOS[gameState.nextPiece].shape;
    const color = TETROMINOS[gameState.nextPiece].color;
    
    return Array(4).fill(null).map((_, y) =>
      Array(4).fill(null).map((_, x) => {
        const isActive = shape[y]?.[x] === 1;
        return <Cell key={`next-${y}-${x}`} color={isActive ? color : ''} />;
      })
    );
  };

  const startGame = (difficulty: Difficulty) => {
    setGameState({
      board: createEmptyBoard(),
      piece: createNewPiece(getRandomPiece()),
      nextPiece: getRandomPiece(),
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      difficulty,
      combo: 0,
      backToBack: false
    });
    setIsPaused(false);
    setShowMenu(false);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleExit = () => {
    navigate('/');
  };

  useEffect(() => {
    if (!isPaused && !gameState.gameOver && gameState.piece) {
      const speed = calculateSpeed(gameState.level, gameState.difficulty);
      const gameLoop = setInterval(() => {
        movePiece(0, 1);
      }, speed);

      return () => {
        clearInterval(gameLoop);
      };
    }
  }, [gameState.level, gameState.piece, isPaused, gameState.gameOver, gameState.difficulty]);

  useEffect(() => {
    if (gameState.gameOver || isPaused) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case 'Space':
          dropPiece();
          break;
        case 'Escape':
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState.gameOver, isPaused, movePiece, rotatePiece, dropPiece]);

  return (
    <GameContainer>
      {showMenu ? (
        <MenuOverlay>
          <GameMenu
            isVisible={true}
            gameTitle="Tetris"
            onStart={() => startGame(gameState.difficulty)}
            onHome={handleExit}
            showDifficulty={true}
            difficulty={gameState.difficulty}
            onDifficultyChange={(newDifficulty) => 
              setGameState(prev => ({ ...prev, difficulty: newDifficulty }))
            }
          />
        </MenuOverlay>
      ) : (
        <GameArea>
          <GameBoard
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {renderBoard()}
          </GameBoard>
          <SidePanel>
            <NextPiece>
              {renderNextPiece()}
            </NextPiece>
            <InfoPanel>
              <h3>Score</h3>
              <p>{gameState.score}</p>
              <h3>Lines</h3>
              <p>{gameState.lines}</p>
              <h3>Level</h3>
              <p>{gameState.level}</p>
              <h3>Combo</h3>
              <p>{gameState.combo}x</p>
            </InfoPanel>
            <Button onClick={togglePause}>{isPaused ? 'Resume' : 'Pause'}</Button>
            <Button onClick={handleExit} style={{ backgroundColor: theme.colors.accent }}>
              Exit
            </Button>
          </SidePanel>
          {(isPaused || gameState.gameOver) && (
            <MenuOverlay>
              <GameMenu
                isVisible={true}
                gameTitle={gameState.gameOver ? 'Game Over!' : 'Paused'}
                score={gameState.score}
                onStart={togglePause}
                onRestart={() => startGame(gameState.difficulty)}
                onHome={() => setShowMenu(true)}
                showDifficulty={gameState.gameOver}
                difficulty={gameState.difficulty}
                onDifficultyChange={(newDifficulty) => 
                  setGameState(prev => ({ ...prev, difficulty: newDifficulty }))
                }
                isGameOver={gameState.gameOver}
              />
            </MenuOverlay>
          )}
          <Controls>
            <ControlButton onTouchStart={() => movePiece(-1, 0)}>←</ControlButton>
            <ControlButton onTouchStart={() => rotatePiece()}>↻</ControlButton>
            <ControlButton onTouchStart={() => movePiece(1, 0)}>→</ControlButton>
            <ControlButton onTouchStart={() => movePiece(0, 1)}>↓</ControlButton>
            <ControlButton onTouchStart={() => dropPiece()}>⤓</ControlButton>
          </Controls>
        </GameArea>
      )}
      <AudioControls game="tetris" />
    </GameContainer>
  );
};

export default Tetris;
