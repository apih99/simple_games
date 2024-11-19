import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Snake from './components/Snake/Snake';
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #40E0D0;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snake" element={<Snake />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
