import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { socket } from "./socket";
import HomePage from "./HomePage";
import GamePage from "./GamePage";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    function onConnect() {
      console.log("client connected");
    }

    function onJoin(status, roomId) {
      if (status == 0) {
        console.log("[client] room successfully joined!");
        navigate(`/room/${roomId}`);
      } else if (status == 1) {
        console.log("[client] room does not exist");
      } else if (status == 2) {
        console.log("[client] room is already full!");
      } else if (status == 3) {
        console.log("[client] room full, game is starting!")
        navigate(`/room/${roomId}`);
      }
    }

    socket.on("connect", onConnect);
    socket.on("joinStatus", (status, roomId) => onJoin(status, roomId));
    return () => {
      socket.off("connect", onConnect);
      socket.off("joinStatus", onJoin);
    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomId" element={<GamePage />} />
    </Routes>
  );
}

export default App;

/**
 * Game state as parent component to hold information
 * ex. totalPts, curPts
 * Minimal representation: also going to need a scoreboard
 * Socket.io -- let people set their own usernames?
 */
