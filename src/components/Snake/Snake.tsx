import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useNavigate } from 'react-router-dom';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a0011 0%, #3d0a2c 100%);
  min-height: 100vh;
  position: relative;

  @media (max-width: 768px) {
    padding: 0;
    height: 100vh;
    
    &.fullscreen {
      height: 100vh;
      width: 100vw;
      padding: 0;
    }
  }
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(61, 10, 44, 0.95);
  padding: 2rem;
  border-radius: ${theme.borderRadius.large};
  box-shadow: 0 0 20px rgba(255, 182, 193, 0.3);
  text-align: center;
  min-width: 300px;
  backdrop-filter: blur(10px);
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(20, min(20px, 4.5vw));
  grid-template-rows: repeat(20, min(20px, 4.5vw));
  gap: 1px;
  background: rgba(61, 10, 44, 0.8);
  padding: 10px;
  border-radius: ${theme.borderRadius.large};
  box-shadow: 0 0 30px rgba(255, 182, 193, 0.2);
  touch-action: none;
`;

const Cell = styled.div<{ isSnake?: boolean; isFood?: boolean }>`
  width: min(20px, 4.5vw);
  height: min(20px, 4.5vw);
  border-radius: 4px;
  background-color: ${({ isSnake, isFood }) =>
    isSnake
      ? '#ff69b4'
      : isFood
      ? '#ff1493'
      : 'rgba(26, 0, 17, 0.6)'};
  transition: background-color 0.1s ease;
  box-shadow: ${({ isSnake, isFood }) =>
    isSnake || isFood ? '0 0 5px rgba(255, 182, 193, 0.5)' : 'none'};
`;

const Score = styled.div`
  font-size: 2rem;
  color: #ff69b4;
  margin: 1rem 0;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

const Controls = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-top: 1rem;
    width: 100%;
    max-width: 300px;
    padding: 0 1rem;
  }
`;

const ControlButton = styled.button<{ size?: string }>`
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  border: none;
  padding: ${props => props.size === 'large' ? '1.5rem' : '1rem'};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${props => props.size === 'large' ? '2rem' : '1.5rem'};
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(255, 105, 180, 0.3);
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 0 10px rgba(255, 105, 180, 0.2);
  }
`;

const FullscreenButton = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  font-size: 1.2rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const GameOver = styled(MenuContainer)`
  h2 {
    color: #ff69b4;
    font-size: 2rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
  }
`;

const MenuTitle = styled.h1`
  color: #ff69b4;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  margin: 0.5rem;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(255, 105, 180, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DifficultyButton = styled(Button)<{ isSelected?: boolean }>`
  background: ${({ isSelected }) =>
    isSelected
      ? 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)'
      : 'linear-gradient(135deg, #3d0a2c 0%, #1a0011 100%)'};
  border: 2px solid #ff69b4;
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.7)};
`;

const HighScore = styled.div`
  color: #ff69b4;
  font-size: 1.2rem;
  margin: 1rem 0;
  text-shadow: 0 0 5px rgba(255, 105, 180, 0.3);
`;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type Difficulty = 'easy' | 'medium' | 'hard';

const difficultySettings = {
  easy: { speed: 200, points: 1 },
  medium: { speed: 150, points: 2 },
  hard: { speed: 100, points: 3 },
};

const Snake: React.FC = () => {
  const navigate = useNavigate();
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const gameLoopRef = useRef<number>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [swipeThreshold] = useState(30);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    setFood({ x, y });
  }, []);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    generateFood();
  };

  const returnToMenu = () => {
    setGameOver(false);
    setIsPlaying(false);
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setScore(0);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const pauseGame = () => {
    setIsPlaying(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const resumeGame = () => {
    setIsPlaying(true);
  };

  const checkCollision = (head: Position): boolean => {
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
      return true;
    }
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      if (checkCollision(head)) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
        }
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + difficultySettings[difficulty].points);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood, score, highScore, difficulty]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case 'Escape':
          setIsPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, difficultySettings[difficulty].speed);
      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [moveSnake, isPlaying, gameOver, difficulty]);

  const exitGame = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    navigate('/');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameOver || !isPlaying) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || gameOver || !isPlaying) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && direction !== 'LEFT') {
          setDirection('RIGHT');
        } else if (deltaX < 0 && direction !== 'RIGHT') {
          setDirection('LEFT');
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && direction !== 'UP') {
          setDirection('DOWN');
        } else if (deltaY < 0 && direction !== 'DOWN') {
          setDirection('UP');
        }
      }
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        if (gameContainerRef.current?.requestFullscreen) {
          await gameContainerRef.current.requestFullscreen();
        } else if ((gameContainerRef.current as any)?.webkitRequestFullscreen) {
          await (gameContainerRef.current as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
        if (window.screen?.orientation?.lock) {
          try {
            await window.screen.orientation.lock('portrait');
          } catch (e) {
            console.log('Orientation lock not supported');
          }
        }
      } catch (err) {
        console.log('Error attempting to enable fullscreen:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
      if (window.screen?.orientation?.unlock) {
        try {
          await window.screen.orientation.unlock();
        } catch (e) {
          console.log('Orientation unlock not supported');
        }
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!isPlaying && !gameOver) {
    return (
      <GameContainer 
        ref={gameContainerRef}
        className={isFullscreen ? 'fullscreen' : ''}
      >
        <MenuContainer>
          <MenuTitle>🐍 Snake Game</MenuTitle>
          <div>
            <h3 style={{ color: '#ff69b4', marginBottom: '1rem' }}>Select Difficulty:</h3>
            {Object.keys(difficultySettings).map((diff) => (
              <DifficultyButton
                key={diff}
                isSelected={difficulty === diff}
                onClick={() => setDifficulty(diff as Difficulty)}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </DifficultyButton>
            ))}
          </div>
          {highScore > 0 && <HighScore>High Score: {highScore}</HighScore>}
          <Button onClick={startGame}>Start Game</Button>
          <Button onClick={exitGame}>Exit to Home</Button>
        </MenuContainer>
      </GameContainer>
    );
  }

  return (
    <GameContainer 
      ref={gameContainerRef}
      className={isFullscreen ? 'fullscreen' : ''}
    >
      <Score>Score: {score}</Score>
      <GameBoard
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: 20 }, (_, y) =>
          Array.from({ length: 20 }, (_, x) => (
            <Cell
              key={`${x}-${y}`}
              isSnake={snake.some(segment => segment.x === x && segment.y === y)}
              isFood={food.x === x && food.y === y}
            />
          ))
        )}
      </GameBoard>
      <Controls>
        <ControlButton onTouchStart={() => direction !== 'RIGHT' && setDirection('LEFT')}>←</ControlButton>
        <ControlButton onTouchStart={() => direction !== 'DOWN' && setDirection('UP')}>↑</ControlButton>
        <ControlButton onTouchStart={() => direction !== 'LEFT' && setDirection('RIGHT')}>→</ControlButton>
        <ControlButton onTouchStart={() => pauseGame()}>❚❚</ControlButton>
        <ControlButton onTouchStart={() => direction !== 'UP' && setDirection('DOWN')}>↓</ControlButton>
        <ControlButton onTouchStart={() => returnToMenu()}>↩</ControlButton>
      </Controls>
      <FullscreenButton onClick={toggleFullscreen}>
        {isFullscreen ? '⤧' : '⤢'}
      </FullscreenButton>
      {gameOver && (
        <GameOver>
          <h2>Game Over!</h2>
          <p style={{ color: '#ff69b4', marginBottom: '1rem' }}>Final Score: {score}</p>
          {score === highScore && score > 0 && (
            <p style={{ color: '#ff1493', marginBottom: '1rem' }}>New High Score! 🎉</p>
          )}
          <Button onClick={startGame}>Play Again</Button>
          <Button onClick={returnToMenu}>Main Menu</Button>
          <Button onClick={exitGame}>Exit to Home</Button>
        </GameOver>
      )}
    </GameContainer>
  );
};

export default Snake;
