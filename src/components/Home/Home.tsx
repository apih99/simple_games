import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AudioControls from '../common/AudioControls';
import { theme } from '../../styles/theme';

const GameIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0;
  }
`;

const GameTitle = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: 1.5rem;
  margin: 0;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const GameDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const GameInfo = styled.div`
  text-align: center;
  flex: 1;

  @media (max-width: 480px) {
    text-align: left;
    padding-left: 1rem;
  }
`;

const GameCard = styled(Link)`
  background: ${theme.colors.gradients.card};
  border-radius: ${theme.borderRadius.large};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.medium};
  backdrop-filter: blur(8px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.glow};
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 0.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0;
  }
`;

const Title = styled.h1`
  color: ${theme.colors.text.primary};
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  background: ${theme.colors.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${theme.shadows.glow};

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const Footer = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-top: 1.5rem;
  }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  background: ${theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const GAMES = [
  {
    title: 'Snake',
    emoji: '🐍',
    route: '/snake',
    description: 'Classic snake game with a modern twist'
  },
  {
    title: 'Tic Tac Toe',
    emoji: '⭕',
    route: '/tictactoe',
    description: 'Challenge your friends or play against AI!'
  },
  {
    title: 'Tetris',
    emoji: '🟦',
    route: '/tetris',
    description: 'The timeless puzzle game'
  },
  {
    title: 'Flappy Bird',
    emoji: '🐤',
    route: '/flappybird',
    description: 'Guide the bird through obstacles'
  },
  {
    title: 'Minesweeper',
    emoji: '💣',
    route: '/minesweeper',
    description: 'Classic puzzle game of mines and flags'
  }
];

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Title>Pishang Games</Title>
      <h2>Main jelah apa nak main!</h2>
      <GamesGrid>
        {GAMES.map((game, index) => (
          <GameCard key={index} to={game.route}>
            <GameIcon>{game.emoji}</GameIcon>
            <GameInfo>
              <GameTitle>{game.title}</GameTitle>
              <GameDescription>{game.description}</GameDescription>
            </GameInfo>
          </GameCard>
        ))}
      </GamesGrid>
      <AudioControls game="menu" />
      <Footer>Created by apih99</Footer>
    </HomeContainer>
  );
};

export default Home;
