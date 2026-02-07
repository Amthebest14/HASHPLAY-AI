import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainFloor } from './pages/MainFloor';
import { RewardIntelligence } from './pages/RewardIntelligence';
import { Leaderboard } from './pages/Leaderboard';
import { NFTVault } from './pages/NFTVault';
import { initializeHashConnect } from './services/hashconnect';
import { HealthCheck } from './components/layout/HealthCheck';

function App() {
  useEffect(() => {
    initializeHashConnect();
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<MainFloor />} />
          <Route path="/rewards" element={<RewardIntelligence />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/vault" element={<NFTVault />} />
        </Routes>
        <HealthCheck />
      </div>
    </Router>
  );
}

export default App;
