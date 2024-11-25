import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './components/Home/Home';
import Snake from './components/Snake/Snake';
import TicTacToe from './components/TicTacToe/TicTacToe';
import Tetris from './components/Tetris/Tetris';
import FlappyBird from './components/FlappyBird/FlappyBird';
import Minesweeper from './components/Minesweeper/Minesweeper';
import CheckersGame from './components/Checkers/Checkers';
import { audioManager } from './utils/audio';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #40E0D0;
`;

const App: React.FC = () => {
  useEffect(() => {
    // Start playing background music when app loads
    audioManager.playGameMusic('menu');
  }, []);

  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snake" element={<Snake />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/tetris" element={<Tetris />} />
          <Route path="/flappybird" element={<FlappyBird />} />
          <Route path="/minesweeper" element={<Minesweeper />} />
          <Route path="/checkers" element={<CheckersGame />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
