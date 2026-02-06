import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainFloor } from './pages/MainFloor';
import { RewardIntelligence } from './pages/RewardIntelligence';
import { Leaderboard } from './pages/Leaderboard';
import { NFTVault } from './pages/NFTVault';
import { initializeHashConnect } from './services/hashconnect';

function App() {
  useEffect(() => {
    initializeHashConnect();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFloor />} />
        <Route path="/rewards" element={<RewardIntelligence />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/vault" element={<NFTVault />} />
      </Routes>
    </Router>
  );
}

export default App;
