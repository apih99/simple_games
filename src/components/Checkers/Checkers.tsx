import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GameContainer, GameHeader, BackButton } from '../common/CommonStyles';

type PieceType = {
  isKing: boolean;
  isRed: boolean;
} | null;

type Position = {
  row: number;
  col: number;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
  margin: 0 auto;
  border: 4px solid #2c3e50;
  border-radius: 8px;
  background: #34495e;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-out;
`;

const Square = styled.div<{ $isBlack: boolean; $isSelected: boolean; $isValidMove: boolean }>`
  aspect-ratio: 1;
  background-color: ${props => 
    props.$isSelected ? '#f1c40f' :
    props.$isValidMove ? '#2ecc71' :
    props.$isBlack ? '#34495e' : '#ecf0f1'
  };
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: ${props => props.$isValidMove ? 'scale(0.95)' : 'none'};
    box-shadow: ${props => props.$isValidMove ? '0 0 10px rgba(46, 204, 113, 0.5)' : 'none'};
  }

  &::before {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 4px;
    background: ${props => props.$isValidMove ? 'rgba(46, 204, 113, 0.2)' : 'transparent'};
    animation: ${props => props.$isValidMove ? glow : 'none'} 1.5s infinite;
  }
`;

const Piece = styled.div<{ $isRed: boolean; $isKing: boolean; $isAnimating?: boolean }>`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: ${props => props.$isRed ? 
    'radial-gradient(circle at 30% 30%, #e74c3c, #c0392b)' : 
    'radial-gradient(circle at 30% 30%, #2c3e50, #1a1a1a)'
  };
  border: 3px solid ${props => props.$isRed ? '#ecf0f1' : '#bdc3c7'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: transform 0.3s ease;
  animation: ${props => props.$isAnimating ? bounce : 'none'} 0.5s ease;

  &:hover {
    transform: scale(1.1);
  }

  &::after {
    content: ${props => props.$isKing ? '"👑"' : '""'};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.4rem;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
  }
`;

const GameStatus = styled.div`
  text-align: center;
  margin: 1rem 0;
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-out;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background: #3498db;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const MenuTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  text-align: center;
`;

const MenuButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: #3498db;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: center;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ColorSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const ColorOption = styled.button<{ $color: 'black' | 'red'; $isSelected: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid ${props => props.$isSelected ? '#f1c40f' : 'transparent'};
  background: ${props => props.$color === 'black' ? '#2c3e50' : '#e74c3c'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }
`;

type GameMode = 'menu' | 'playing';

const CheckersGame: React.FC = () => {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [board, setBoard] = useState<(PieceType)[][]>(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'black'>('black');
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [playerColor, setPlayerColor] = useState<'black' | 'red'>('black');

  function initializeBoard(): (PieceType)[][] {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place red pieces
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { isKing: false, isRed: true };
        }
      }
    }
    
    // Place black pieces
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { isKing: false, isRed: false };
        }
      }
    }
    
    return board;
  }

  function getValidMoves(row: number, col: number): Position[] {
    const piece = board[row][col];
    if (!piece) return [];

    const moves: Position[] = [];
    const directions = piece.isKing ? [-1, 1] : [piece.isRed ? 1 : -1];
    const jumpMoves: Position[] = [];

    directions.forEach(dRow => {
      [-1, 1].forEach(dCol => {
        // Regular move
        if (isValidPosition(row + dRow, col + dCol) && !board[row + dRow][col + dCol]) {
          moves.push({ row: row + dRow, col: col + dCol });
        }
        
        // Capture move
        if (
          isValidPosition(row + dRow * 2, col + dCol * 2) &&
          !board[row + dRow * 2][col + dCol * 2] &&
          board[row + dRow][col + dCol] &&
          board[row + dRow][col + dCol]?.isRed !== piece.isRed
        ) {
          jumpMoves.push({ row: row + dRow * 2, col: col + dCol * 2 });
        }
      });
    });

    // If there are jump moves available, they are mandatory
    return jumpMoves.length > 0 ? jumpMoves : moves;
  }

  function getAllValidMoves(isRedPlayer: boolean): { piece: Position; moves: Position[] }[] {
    const allMoves: { piece: Position; moves: Position[] }[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.isRed === isRedPlayer) {
          const moves = getValidMoves(row, col);
          if (moves.length > 0) {
            allMoves.push({ piece: { row, col }, moves });
          }
        }
      }
    }
    
    // If there are any jump moves, filter out non-jump moves
    const hasJumpMoves = allMoves.some(({ piece, moves }) => 
      moves.some(move => Math.abs(move.row - piece.row) === 2)
    );
    
    if (hasJumpMoves) {
      return allMoves.filter(({ piece, moves }) => 
        moves.some(move => Math.abs(move.row - piece.row) === 2)
      );
    }
    
    return allMoves;
  }

  function isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  async function makeAIMove() {
    if (currentPlayer !== playerColor && !gameOver) {
      setIsThinking(true);
      
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const allMoves = getAllValidMoves(currentPlayer === 'red');
      if (allMoves.length > 0) {
        // Simple AI: Choose a random valid move with preference for jumps
        const moveIndex = Math.floor(Math.random() * allMoves.length);
        const { piece, moves } = allMoves[moveIndex];
        const targetMove = moves[Math.floor(Math.random() * moves.length)];
        
        handleMove(piece.row, piece.col, targetMove.row, targetMove.col);
      }
      
      setIsThinking(false);
    }
  }

  function handleMove(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol]!;
    
    // Move piece
    newBoard[toRow][toCol] = {
      ...piece,
      isKing: piece.isKing || toRow === 0 || toRow === 7
    };
    newBoard[fromRow][fromCol] = null;

    // Handle capture
    if (Math.abs(toRow - fromRow) === 2) {
      const capturedRow = (toRow + fromRow) / 2;
      const capturedCol = (toCol + fromCol) / 2;
      newBoard[capturedRow][capturedCol] = null;
    }

    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');

    // Check for game over
    const hasRedPieces = newBoard.some(row => row.some(piece => piece?.isRed));
    const hasBlackPieces = newBoard.some(row => row.some(piece => piece && !piece.isRed));
    if (!hasRedPieces || !hasBlackPieces) {
      setGameOver(true);
    }
  }

  function handleSquareClick(row: number, col: number) {
    if (gameOver || (isAIEnabled && currentPlayer !== playerColor)) return;

    const piece = board[row][col];
    
    // If clicking on a piece of current player's color
    if (piece && piece.isRed === (currentPlayer === 'red')) {
      setSelectedPiece({ row, col });
      setValidMoves(getValidMoves(row, col));
      return;
    }

    // If clicking on a valid move position
    if (selectedPiece && validMoves.some(move => move.row === row && move.col === col)) {
      handleMove(selectedPiece.row, selectedPiece.col, row, col);
    }
  }

  useEffect(() => {
    if (isAIEnabled && currentPlayer !== playerColor) {
      makeAIMove();
    }
  }, [currentPlayer, isAIEnabled, playerColor]);

  function resetGame() {
    setBoard(initializeBoard());
    setCurrentPlayer('black');
    setGameOver(false);
    setSelectedPiece(null);
    setValidMoves([]);
  }

  function startGame(withAI: boolean) {
    setIsAIEnabled(withAI);
    setBoard(initializeBoard());
    setCurrentPlayer('black');
    setGameOver(false);
    setSelectedPiece(null);
    setValidMoves([]);
    setGameMode('playing');
  }

  if (gameMode === 'menu') {
    return (
      <GameContainer>
        <GameHeader>
          <BackButton onClick={() => navigate('/')}>Back</BackButton>
        </GameHeader>
        <MenuContainer>
          <MenuTitle>Checkers</MenuTitle>
          <div>
            <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '1rem' }}>
              Choose Your Color
            </h2>
            <ColorSelector>
              <ColorOption 
                $color="black" 
                $isSelected={playerColor === 'black'}
                onClick={() => setPlayerColor('black')}
              />
              <ColorOption 
                $color="red" 
                $isSelected={playerColor === 'red'}
                onClick={() => setPlayerColor('red')}
              />
            </ColorSelector>
          </div>
          <MenuButton onClick={() => startGame(false)}>
            Play vs Friend
          </MenuButton>
          <MenuButton onClick={() => startGame(true)}>
            Play vs AI
          </MenuButton>
        </MenuContainer>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <BackButton onClick={() => setGameMode('menu')}>Back to Menu</BackButton>
        <Controls>
          <Button onClick={resetGame}>New Game</Button>
        </Controls>
      </GameHeader>
      <GameStatus>
        {gameOver 
          ? `Game Over! ${currentPlayer === 'red' ? 'Black' : 'Red'} Wins!` 
          : isThinking
          ? 'AI is thinking...'
          : `Current Player: ${currentPlayer}`}
      </GameStatus>
      <Board>
        {board.map((row, rowIndex) => 
          row.map((piece, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              $isBlack={(rowIndex + colIndex) % 2 === 1}
              $isSelected={selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex}
              $isValidMove={validMoves.some(move => move.row === rowIndex && move.col === colIndex)}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {piece && (
                <Piece
                  $isRed={piece.isRed}
                  $isKing={piece.isKing}
                  $isAnimating={selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex}
                />
              )}
            </Square>
          ))
        )}
      </Board>
    </GameContainer>
  );
};

export default CheckersGame; 