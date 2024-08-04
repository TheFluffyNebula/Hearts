import React from "react";
import { useState } from "react";

function Scoreboard() {
  // Initialize default player names and pt values
  const initPlayers = ["Player 1", "Player 2", "Player 3", "Player 4"];
  const initPts = [0, 0, 0, 0];
  const [players, setPlayers] = useState(initPlayers);
  const [pts, setPts] = useState(initPts);

  return (
    <div className="scoreboard">
      {players.map((player, index) => (
        <div className="player" key={index}>
          <h3>{player}</h3>
          <p>Points: {pts[index]}</p>
        </div>
      ))}
    </div>
  );
}

export default Scoreboard;
