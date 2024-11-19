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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: ${theme.transitions.default};
  z-index: ${theme.zIndex.menu};
  backdrop-filter: blur(8px);
`;

const MenuContainer = styled.div`
  background: ${theme.colors.background.card};
  padding: 2rem;
  border-radius: ${theme.borderRadius.large};
  min-width: 320px;
  max-width: 90%;
  text-align: center;
  box-shadow: ${theme.shadows.large}, 0 0 30px rgba(255, 120, 185, 0.2);
  transform: translateY(0);
  transition: ${theme.transitions.default};

  ${MenuOverlay}:hover & {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.large}, ${theme.shadows.glow};
  }
`;

const Title = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.heading.fontSize};
  font-weight: ${theme.typography.heading.fontWeight};
  margin-bottom: 1.5rem;
  background: ${theme.colors.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${theme.shadows.text};
`;

const Score = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 1.2rem;
  margin-bottom: 2rem;

  span {
    color: ${theme.colors.text.accent};
    font-weight: 600;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' 
    ? theme.colors.gradients.primary 
    : theme.colors.background.secondary};
  color: ${props => props.variant === 'primary' 
    ? theme.colors.text.primary 
    : theme.colors.text.secondary};
  border: none;
  padding: 1rem 2rem;
  border-radius: ${theme.borderRadius.medium};
  font-family: ${theme.typography.fontFamily};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transitions.fast};
  box-shadow: ${theme.shadows.small};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'primary' 
      ? theme.shadows.glow 
      : theme.shadows.medium};
  }

  &:active {
    transform: translateY(0);
  }
`;

const DifficultyContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const DifficultyButton = styled(Button)<{ isSelected: boolean }>`
  padding: 0.5rem 1rem;
  opacity: ${props => props.isSelected ? 1 : 0.6};
  transform: scale(${props => props.isSelected ? 1.05 : 1});

  &:hover {
    opacity: 1;
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
  difficulty = 'Medium',
  onDifficultyChange,
  isGameOver
}) => {
  return (
    <MenuOverlay isVisible={isVisible}>
      <MenuContainer>
        <Title>{isGameOver ? 'Game Over!' : gameTitle}</Title>
        
        {(score !== undefined || highScore !== undefined) && (
          <Score>
            {score !== undefined && (
              <div>Score: <span>{score}</span></div>
            )}
            {highScore !== undefined && (
              <div>High Score: <span>{highScore}</span></div>
            )}
          </Score>
        )}

        {showDifficulty && onDifficultyChange && (
          <DifficultyContainer>
            {['Easy', 'Medium', 'Hard'].map((diff) => (
              <DifficultyButton
                key={diff}
                variant="secondary"
                isSelected={difficulty === diff}
                onClick={() => onDifficultyChange(diff as 'Easy' | 'Medium' | 'Hard')}
              >
                {diff}
              </DifficultyButton>
            ))}
          </DifficultyContainer>
        )}

        <ButtonContainer>
          {isGameOver ? (
            <Button variant="primary" onClick={onRestart}>
              Play Again
            </Button>
          ) : (
            <Button variant="primary" onClick={onStart}>
              {score !== undefined ? 'Restart' : 'Start Game'}
            </Button>
          )}
          <Button variant="secondary" onClick={onHome}>
            Back to Home
          </Button>
        </ButtonContainer>
      </MenuContainer>
    </MenuOverlay>
  );
};

export default GameMenu;
