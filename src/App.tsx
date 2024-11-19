import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './components/Home/Home';
import Snake from './components/Snake/Snake';
import TicTacToe from './components/TicTacToe/TicTacToe';
import Tetris from './components/Tetris/Tetris';
import FlappyBird from './components/FlappyBird/FlappyBird';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #40E0D0;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snake" element={<Snake />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/tetris" element={<Tetris />} />
          <Route path="/flappybird" element={<FlappyBird />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
