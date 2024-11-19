import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AudioControls from '../common/AudioControls';
import { theme } from '../../styles/theme';

const GameIcon = styled.span`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
`;

const GameTitle = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  transition: color 0.3s ease;
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 100%);
  font-family: ${theme.typography.fontFamily};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%);
    pointer-events: none;
  }
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 120, 185, 0.3);
  position: relative;
  z-index: 1;
`;

const Description = styled.p`
  color: ${theme.colors.text.primary};
  font-size: 1.5rem;
  margin-bottom: 3rem;
  text-align: center;
  opacity: 0.9;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
`;

const GameCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, 
    rgba(37, 38, 41, 0.9) 0%,
    rgba(26, 27, 30, 0.9) 100%);
  border-radius: ${theme.borderRadius.large};
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      rgba(255, 120, 185, 0.1) 0%,
      rgba(158, 234, 249, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 120, 185, 0.3);

    &::before {
      opacity: 1;
    }

    ${GameIcon} {
      transform: scale(1.1);
      text-shadow: 0 0 20px rgba(255, 120, 185, 0.5);
    }

    ${GameTitle} {
      color: ${theme.colors.primary};
    }
  }
`;

const GameDescription = styled.p`
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  text-align: center;
  margin: 0;
  opacity: 0.7;
  line-height: 1.5;
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
      <Description>Main jelah apa nak main! 🎮</Description>
      <GameGrid>
        {GAMES.map((game, index) => (
          <GameCard key={index} to={game.route}>
            <GameIcon>{game.emoji}</GameIcon>
            <GameTitle>{game.title}</GameTitle>
            <GameDescription>{game.description}</GameDescription>
          </GameCard>
        ))}
      </GameGrid>
      <AudioControls game="menu" />
    </HomeContainer>
  );
};

export default Home;
