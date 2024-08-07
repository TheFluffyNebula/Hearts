import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { socket } from './socket';
import HomePage from "./HomePage";
import GamePage from "./GamePage";

function App() {
  useEffect(() => {
    function onConnect() {
      console.log("client connected");
    }

    socket.on('connect', onConnect);
    return () => {
      socket.off('connect', onConnect);
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;

/**
 * Game state as parent component to hold information
 * ex. totalPts, curPts
 * Minimal representation: also going to need a scoreboard
 * Socket.io -- let people set their own usernames?
 */
