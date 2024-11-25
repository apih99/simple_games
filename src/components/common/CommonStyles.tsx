import styled from 'styled-components';

export const GameContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
`;

export const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Score = styled.div`
  font-size: 24px;
  color: white;
  font-weight: bold;
`;

export const BackButton = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff6666;
  }
`;

// Add an empty export to make this file a module
export {}; 