import React from "react";
import { useState, useEffect } from "react";

function PlayerInfo({ playerNum, curPts, room }) {
  console.log("PlayerInfo re-rendered with curPts:", curPts); // Check if this logs
  // Initialize default player names and pt values
  const [pNum, setPNum] = useState(-1);
  const [rPts, setRPts] = useState(0);
  const [rm, setRm] = useState("");

  useEffect(() => {
    if (playerNum) {
      // only set if prop is present
      setPNum(playerNum);
    }
    // Remove the check for `curPts` so that it updates even when curPts is `0`
    // console.log("curPts updated!", curPts);
    setRPts(curPts);
    if (room) {
      setRm(room);
    }
  }, [playerNum, curPts, room]);

  return (
    <div className="player-info">
      <p>Player {pNum}</p>
      <p>Points this round: {rPts}</p>
      <p>Room: {rm}</p>
    </div>
  );
}

export default PlayerInfo;
