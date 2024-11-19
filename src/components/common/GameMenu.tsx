import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';

const MenuOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: ${props => props.isVisible ? 'all' : 'none'};
  transition: opacity 0.3s ease;
`;

const MenuCard = styled.div<{ isVisible?: boolean }>`
  background: ${theme.colors.gradients.card};
  border-radius: ${theme.borderRadius.large};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 90%;
  width: 400px;
  box-shadow: ${theme.shadows.large};
  transform: scale(${props => props.isVisible ? 1 : 0.9});
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.25rem;
    width: 350px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1rem;
    width: 300px;
  }
`;

const Title = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: 2.5rem;
  text-align: center;
  margin: 0;
  background: ${theme.colors.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background: ${theme.colors.gradients.primary};
  color: ${theme.colors.text.primary};
  font-size: 1.2rem;
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.medium};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }

  @media (max-width: 768px) {
    padding: 0.9rem;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 1rem;
  }
`;

const DifficultySelect = styled.select`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  font-size: 1.2rem;
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.medium};
  appearance: none;
  text-align: center;

  &:focus {
    outline: none;
    box-shadow: ${theme.shadows.glow};
  }

  @media (max-width: 768px) {
    padding: 0.9rem;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 1rem;
  }

  option {
    background: ${theme.colors.background.primary};
  }
`;

interface GameMenuProps {
  isVisible: boolean;
  gameTitle: string;
  score?: number;
  highScore?: number;
  onStart: () => void;
  onRestart?: () => void;
  onHome: () => void;
  showDifficulty?: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  onDifficultyChange?: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  isGameOver?: boolean;
}

const GameMenu: React.FC<GameMenuProps> = ({
  isVisible,
  gameTitle,
  score,
  highScore,
  onStart,
  onRestart,
  onHome,
  showDifficulty,
  difficulty,
  onDifficultyChange,
  isGameOver
}) => {
  return (
    <MenuOverlay isVisible={isVisible}>
      <MenuCard isVisible={isVisible}>
        <Title>{isGameOver ? 'Game Over!' : gameTitle}</Title>
        
        {(score !== undefined || highScore !== undefined) && (
          <div>
            {score !== undefined && (
              <div>Score: <span>{score}</span></div>
            )}
            {highScore !== undefined && (
              <div>High Score: <span>{highScore}</span></div>
            )}
          </div>
        )}

        {showDifficulty && onDifficultyChange && (
          <DifficultySelect value={difficulty} onChange={(e) => onDifficultyChange(e.target.value as 'Easy' | 'Medium' | 'Hard')}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </DifficultySelect>
        )}

        <ButtonGroup>
          {isGameOver ? (
            <Button onClick={onRestart}>
              Play Again
            </Button>
          ) : (
            <Button onClick={onStart}>
              {score !== undefined ? 'Restart' : 'Start Game'}
            </Button>
          )}
          <Button onClick={onHome}>
            Back to Home
          </Button>
        </ButtonGroup>
      </MenuCard>
    </MenuOverlay>
  );
};

export default GameMenu;
