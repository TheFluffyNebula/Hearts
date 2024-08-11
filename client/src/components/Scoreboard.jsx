import React from "react";
import { useState, useEffect } from "react";

function Scoreboard( {totalPts} ) {
  // Initialize default player names and pt values
  const initPlayers = ["Player 1", "Player 2", "Player 3", "Player 4"];
  const initPts = [0, 0, 0, 0];
  const [players, setPlayers] = useState(initPlayers); // username updates (?)
  const [tPts, setTPts] = useState(initPts);

  useEffect(() => {
    if (totalPts) { // only set if prop is present
      setTPts(totalPts);
    }
  }, [totalPts]);

  return (
    <div className="scoreboard">
      {players.map((player, index) => (
        <div className="player" key={index}>
          <h3>{player}</h3>
          <p>Points: {tPts[index]}</p>
        </div>
      ))}
    </div>
  );
}

export default Scoreboard;
