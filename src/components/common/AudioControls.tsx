import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { audioManager } from '../../utils/audio';
import { theme } from '../../styles/theme';

const AudioControlContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
  background: ${theme.colors.gradients.card};
  padding: 12px 16px;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.medium};
  backdrop-filter: blur(8px);
  transition: ${theme.transitions.default};

  &:hover {
    box-shadow: ${theme.shadows.glow};
    transform: translateY(-2px);
  }
`;

const Button = styled.button`
  background: ${theme.colors.gradients.primary};
  color: white;
  border: none;
  padding: 10px;
  border-radius: ${theme.borderRadius.circle};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  width: 40px;
  height: 40px;
  transition: ${theme.transitions.fast};
  box-shadow: ${theme.shadows.small};

  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.medium};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const VolumeSlider = styled.input`
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  background: ${theme.colors.secondary};
  border-radius: 2px;
  outline: none;
  opacity: 0.8;
  transition: ${theme.transitions.default};

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: ${theme.colors.primary};
    border-radius: ${theme.borderRadius.circle};
    cursor: pointer;
    box-shadow: ${theme.shadows.small};
    transition: ${theme.transitions.fast};
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: ${theme.shadows.medium};
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: ${theme.colors.primary};
    border-radius: ${theme.borderRadius.circle};
    cursor: pointer;
    border: none;
    box-shadow: ${theme.shadows.small};
    transition: ${theme.transitions.fast};
  }

  &::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: ${theme.shadows.medium};
  }
`;

interface AudioControlsProps {
  game: 'menu' | 'snake' | 'tetris' | 'flappyBird' | 'ticTacToe';
}

const AudioControls: React.FC<AudioControlsProps> = ({ game }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    const startAudio = async () => {
      try {
        await audioManager.playGameMusic(game);
      } catch (error) {
        console.error('Failed to start audio:', error);
      }
    };

    startAudio();
    
    // Cleanup on unmount
    return () => {
      audioManager.stopMusic();
    };
  }, [game]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioManager.toggleMute();
  };

  return (
    <AudioControlContainer>
      <Button onClick={handleMuteToggle} title={isMuted ? "Unmute" : "Mute"}>
        {isMuted ? '🔇' : '🔊'}
      </Button>
      <VolumeSlider
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        title={`Volume: ${Math.round(volume * 100)}%`}
      />
    </AudioControlContainer>
  );
};

export default AudioControls;
