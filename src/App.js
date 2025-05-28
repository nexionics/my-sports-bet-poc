import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home      from './components/Home';
import SportPage from './components/SportPage';
import GamePage  from './components/GamePage';
import WagerPage from './components/WagerPage';
import MyBets    from './components/MyBets';

export const BetsContext = React.createContext();

function App() {
  // 1) Initialize from localStorage or empty array
  const [bets, setBets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bets')) || [];
    } catch {
      return [];
    }
  });

  // 2) Whenever bets change, write them back to localStorage
  useEffect(() => {
    localStorage.setItem('bets', JSON.stringify(bets));
  }, [bets]);

  return (
    <BetsContext.Provider value={{ bets, setBets }}>
      <Router>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/sport/:key"  element={<SportPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/wager/:betId" element={<WagerPage />} />
          <Route path="/my-bets"     element={<MyBets />} />
        </Routes>
      </Router>
    </BetsContext.Provider>
  );
}

export default App;