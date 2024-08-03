// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import React from 'react';
import CenterCards from './components/CenterCards';
import Hand from './components/Hand';
import Card from './components/Card';

// const SUITS = ["♠", "♣", "♥", "♦"]
function App() {
  return (
    // <h1>Hi!</h1>
    <div className="app">
      <CenterCards />
      <Hand />
    </div>
  );
}

export default App;
/**
 * Game state as parent component to hold information
 * ex. totalPts, curPts
 * Minimal representation: also going to need a scoreboard
 * Socket.io -- let people set their own usernames?
 */
