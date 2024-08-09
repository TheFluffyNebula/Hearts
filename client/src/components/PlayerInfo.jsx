import React from "react";
import { useState, useEffect } from "react";

function PlayerInfo({ playerNum }) {
  // Initialize default player names and pt values
  const [pNum, setPNum] = useState(-1);
  const [curPts, setCurPts] = useState(0);

  useEffect(() => {
    if (playerNum) { // only set if prop is present
      setPNum(playerNum);
    }
  }, [playerNum]);

  return (
    <div className="player-info">
      <p>Player {pNum}</p>
      <p>Points this round: {curPts}</p>
    </div>
  );
}

export default PlayerInfo;
