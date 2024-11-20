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

const Canvas = styled.canvas`
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.large};
  background: ${theme.colors.background.secondary};
  width: min(800px, 100%);
  height: auto;
  touch-action: none;
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 2rem;
  color: ${theme.colors.text.primary};
  font-size: 2rem;
  font-weight: 600;
  text-shadow: ${theme.shadows.text};
  z-index: 10;
`;

const Bird = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FFD700;
`;

const Pipe = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 600px;
  background-color: #20B2AA;
`;

interface Bird {
  x: number;
  y: number;
  velocity: number;
  radius: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  gap: number;
  width: number;
  scored: boolean;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const DIFFICULTY_SETTINGS = {
  Easy: {
    gravity: 0.7,
    jumpForce: -8,
    pipeSpeed: 2,
    pipeGap: 180,
    pipeSpawnRate: 120
  },
  Medium: {
    gravity: 0.7,
    jumpForce: -9,
    pipeSpeed: 3,
    pipeGap: 160,
    pipeSpawnRate: 100
  },
  Hard: {
    gravity: 0.7,
    jumpForce: -10,
    pipeSpeed: 4,
    pipeGap: 140,
    pipeSpawnRate: 80
  }
};

const FlappyBird: React.FC = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [bird, setBird] = useState<Bird>({
    x: 100,
    y: 250,
    velocity: 0,
    radius: 20
  });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [frameCount, setFrameCount] = useState(0);
  const [canvasScale, setCanvasScale] = useState(1);

  const drawBird = useCallback((ctx: CanvasRenderingContext2D, bird: Bird) => {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw eye
    ctx.beginPath();
    ctx.arc(bird.x + 8, bird.y - 5, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    
    // Draw beak
    ctx.beginPath();
    ctx.moveTo(bird.x + 15, bird.y);
    ctx.lineTo(bird.x + 30, bird.y);
    ctx.lineTo(bird.x + 15, bird.y + 5);
    ctx.fillStyle = '#FFA500';
    ctx.fill();
  }, []);

  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, pipe: Pipe) => {
    // Draw top pipe
    ctx.fillStyle = '#20B2AA';
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
    
    // Draw bottom pipe
    ctx.fillRect(pipe.x, pipe.topHeight + pipe.gap, pipe.width, 600 - (pipe.topHeight + pipe.gap));
    
    // Draw pipe caps
    ctx.fillStyle = '#008B8B';
    ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);
    ctx.fillRect(pipe.x - 5, pipe.topHeight + pipe.gap, pipe.width + 10, 20);
  }, []);

  const drawScore = useCallback((ctx: CanvasRenderingContext2D, score: number) => {
    ctx.fillStyle = '#008B8B';
    ctx.font = '40px "Comic Sans MS"';
    ctx.textAlign = 'center';
    ctx.fillText(score.toString(), 400, 50);
  }, []);

  const checkCollision = useCallback((bird: Bird, pipe: Pipe) => {
    // Check if bird hits the pipes
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipe.width &&
      (bird.y - bird.radius < pipe.topHeight ||
        bird.y + bird.radius > pipe.topHeight + pipe.gap)
    ) {
      return true;
    }
    
    // Check if bird hits the ground or ceiling
    if (bird.y + bird.radius > 600 || bird.y - bird.radius < 0) {
      return true;
    }
    
    return false;
  }, []);

  const gameLoop = useCallback(() => {
    if (!canvasRef.current || !gameStarted || gameOver) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const settings = DIFFICULTY_SETTINGS[difficulty];
    
    // Clear canvas
    ctx.clearRect(0, 0, 800, 600);
    
    // Update bird
    setBird(prev => ({
      ...prev,
      y: prev.y + prev.velocity,
      velocity: prev.velocity + settings.gravity
    }));
    
    // Update pipes and check for score
    setPipes(prev => {
      const newPipes = prev
        .map(pipe => {
          const newPipe = {
            ...pipe,
            x: pipe.x - settings.pipeSpeed
          };

          // Check for score only if pipe hasn't been scored yet
          if (!pipe.scored && 
              bird.x > pipe.x + pipe.width && 
              bird.y > pipe.topHeight && 
              bird.y < pipe.topHeight + pipe.gap) {
            setScore(s => s + 1);
            newPipe.scored = true;
          }

          return newPipe;
        })
        .filter(pipe => pipe.x + pipe.width > -50);
      
      // Add new pipe
      if (frameCount % settings.pipeSpawnRate === 0) {
        const topHeight = Math.random() * (400 - 100) + 100;
        newPipes.push({
          x: 800,
          topHeight,
          gap: settings.pipeGap,
          width: 60,
          scored: false
        });
      }
      
      return newPipes;
    });
    
    // Check collisions
    pipes.forEach(pipe => {
      if (checkCollision(bird, pipe)) {
        setGameOver(true);
        setHighScore(prev => Math.max(prev, score));
      }
    });
    
    // Draw everything
    drawBird(ctx, bird);
    pipes.forEach(pipe => drawPipe(ctx, pipe));
    drawScore(ctx, score);
    
    setFrameCount(prev => prev + 1);
  }, [bird, pipes, gameStarted, gameOver, score, difficulty, frameCount]);

  useEffect(() => {
    const interval = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(interval);
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!gameStarted || gameOver) {
          startGame();
        } else {
          setBird(prev => ({
            ...prev,
            velocity: DIFFICULTY_SETTINGS[difficulty].jumpForce
          }));
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, difficulty]);

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (!gameStarted || gameOver) {
        startGame();
      } else {
        setBird(prev => ({
          ...prev,
          velocity: DIFFICULTY_SETTINGS[difficulty].jumpForce
        }));
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouch);
      return () => canvas.removeEventListener('touchstart', handleTouch);
    }
  }, [gameStarted, gameOver, difficulty]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const containerWidth = canvas.parentElement?.clientWidth || window.innerWidth;
        const scale = Math.min(1, containerWidth / 800);
        setCanvasScale(scale);
        
        // Update canvas display size while maintaining internal resolution
        canvas.style.width = `${800 * scale}px`;
        canvas.style.height = `${600 * scale}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    setBird({
      x: 100,
      y: 250,
      velocity: 0,
      radius: 20
    });
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setFrameCount(0);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <GameContainer>
      <ScoreDisplay>{score}</ScoreDisplay>
      <Canvas 
        ref={canvasRef} 
        width={800} 
        height={600}
      />
      <AudioControls game="flappyBird" />
      <GameMenu
        isVisible={!gameStarted || gameOver}
        gameTitle="Flappy Bird"
        score={score}
        highScore={highScore}
        onStart={startGame}
        onRestart={startGame}
        onHome={handleHome}
        showDifficulty={true}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        isGameOver={gameOver}
      />
    </GameContainer>
  );
};

export default FlappyBird;
