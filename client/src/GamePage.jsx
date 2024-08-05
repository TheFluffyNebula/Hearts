import React from 'react';
import Hand from './components/Hand';
import CenterCards from './components/CenterCards';
import Scoreboard from './components/Scoreboard';

function GamePage() {
  return (
    <div className="game-page">
      <CenterCards />
      <Hand />
      <Scoreboard />
    </div>
  );
}

export default GamePage;
