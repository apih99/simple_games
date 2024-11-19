import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #40E0D0;
  font-family: 'Comic Sans MS', cursive;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 20px);
  grid-template-rows: repeat(20, 20px);
  gap: 1px;
  background-color: #48D1CC;
  border: 10px solid #20B2AA;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Cell = styled.div<{ isSnake?: boolean; isFood?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background-color: ${({ isSnake, isFood }) =>
    isSnake ? '#20B2AA' : isFood ? '#98FF98' : '#E0FFFF'};
  ${({ isSnake }) =>
    isSnake &&
    `
    box-shadow: 0 0 5px rgba(32, 178, 170, 0.5);
  `}
`;

const Score = styled.div`
  font-size: 2rem;
  color: #008B8B;
  margin: 1rem 0;
`;

const MenuOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(224, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
  background-color: #20B2AA;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.2rem;
  margin: 0.5rem;

  &:hover {
    background-color: #008B8B;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SpeedControl = styled.div`
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;

  select {
    padding: 0.5rem;
    border-radius: 5px;
    border: 2px solid #20B2AA;
    background-color: #E0FFFF;
    font-family: inherit;
  }
`;

type Position = {
  x: number;
  y: number;
};

const Snake: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>('RIGHT');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(100);
  const navigate = useNavigate();

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    setFood({ x, y });
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setShowMenu(false);
    generateFood();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    setShowMenu(!isPaused);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(Number(event.target.value));
  };

  const checkCollision = (head: Position) => {
    if (
      head.x < 0 ||
      head.x >= 20 ||
      head.y < 0 ||
      head.y >= 20 ||
      snake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      return true;
    }
    return false;
  };

  const handleExit = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        togglePause();
        return;
      }

      if (!isPaused && !gameOver) {
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
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPaused, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

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
        setShowMenu(true);
        return;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver, isPaused, speed, generateFood]);

  return (
    <GameContainer>
      <Score>Score: {score}</Score>
      <Controls>
        <Button onClick={togglePause}>{isPaused ? 'Resume' : 'Pause'}</Button>
        <SpeedControl>
          <label>Speed:</label>
          <select value={speed} onChange={handleSpeedChange}>
            <option value="150">Slow</option>
            <option value="100">Normal</option>
            <option value="70">Fast</option>
            <option value="50">Very Fast</option>
          </select>
        </SpeedControl>
      </Controls>
      <GameBoard>
        {Array.from({ length: 20 }, (_, y) =>
          Array.from({ length: 20 }, (_, x) => (
            <Cell
              key={`${x}-${y}`}
              isSnake={snake.some((segment) => segment.x === x && segment.y === y)}
              isFood={food.x === x && food.y === y}
            />
          ))
        )}
      </GameBoard>
      {(showMenu || gameOver) && (
        <MenuOverlay>
          <h2 style={{ color: '#008B8B' }}>
            {gameOver ? 'Game Over!' : isPaused ? 'Paused' : 'Snake Game'}
          </h2>
          {gameOver && <p>Final Score: {score}</p>}
          <Button onClick={resetGame}>
            {gameOver ? 'Play Again' : 'New Game'}
          </Button>
          {!gameOver && (
            <>
              <Button onClick={() => setShowMenu(false)}>Resume</Button>
              <Button onClick={handleExit} style={{ backgroundColor: '#DC143C' }}>
                Exit to Menu
              </Button>
            </>
          )}
          {gameOver && (
            <Button onClick={handleExit} style={{ backgroundColor: '#DC143C' }}>
              Exit to Menu
            </Button>
          )}
        </MenuOverlay>
      )}
    </GameContainer>
  );
};

export default Snake;
