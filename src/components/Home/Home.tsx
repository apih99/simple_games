import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #ffd6e6;
  font-family: 'Comic Sans MS', cursive;
`;

const Title = styled.h1`
  color: #ff69b4;
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 2rem;
`;

const GameCard = styled(Link)`
  background-color: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  text-decoration: none;
  color: #ff69b4;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    margin: 1rem 0;
  }
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Title>🎮 Cute Arcade 🎮</Title>
      <GameGrid>
        <GameCard to="/snake">
          <h2>🐍 Snake</h2>
          <p>Classic snake game with a cute twist!</p>
        </GameCard>
        <GameCard to="/tictactoe">
          <h2>⭕ Tic Tac Toe</h2>
          <p>Coming Soon!</p>
        </GameCard>
        <GameCard to="/tetris">
          <h2>🟦 Tetris</h2>
          <p>Coming Soon!</p>
        </GameCard>
        <GameCard to="/flappybird">
          <h2>🐦 Flappy Bird</h2>
          <p>Coming Soon!</p>
        </GameCard>
      </GameGrid>
    </HomeContainer>
  );
};

export default Home;
