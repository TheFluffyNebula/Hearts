import React from "react";
import { useState, useEffect } from "react";

function PlayerInfo({ playerNum, curPts }) {
  // Initialize default player names and pt values
  const [pNum, setPNum] = useState(-1);
  const [rPts, setRPts] = useState(0);

  useEffect(() => {
    if (playerNum) { // only set if prop is present
      setPNum(playerNum);
    }
    if (curPts) { // only set if prop is present
      setRPts(curPts);
    }
  }, [playerNum, curPts]);

  return (
    <div className="player-info">
      <p>Player {pNum}</p>
      <p>Points this round: {rPts}</p>
    </div>
  );
}

export default PlayerInfo;
