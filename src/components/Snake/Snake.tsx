import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #ffd6e6;
  font-family: 'Comic Sans MS', cursive;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 20px);
  grid-template-rows: repeat(20, 20px);
  gap: 1px;
  background-color: #ffb6c1;
  border: 10px solid #ff69b4;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Cell = styled.div<{ isSnake?: boolean; isFood?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background-color: ${({ isSnake, isFood }) =>
    isSnake ? '#ff69b4' : isFood ? '#98ff98' : '#fff'};
  ${({ isSnake }) =>
    isSnake &&
    `
    box-shadow: 0 0 5px rgba(255, 105, 180, 0.5);
  `}
`;

const Score = styled.div`
  font-size: 2rem;
  color: #ff69b4;
  margin: 1rem 0;
`;

const GameOver = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  h2 {
    color: #ff69b4;
    margin-bottom: 1rem;
  }

  button {
    background-color: #ff69b4;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: 1.2rem;

    &:hover {
      background-color: #ff1493;
    }
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
    generateFood();
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

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

    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver, generateFood]);

  return (
    <GameContainer>
      <Score>Score: {score}</Score>
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
      {gameOver && (
        <GameOver>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </GameOver>
      )}
    </GameContainer>
  );
};

export default Snake;
