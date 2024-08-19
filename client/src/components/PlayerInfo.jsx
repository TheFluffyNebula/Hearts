import React from "react";
import { useState, useEffect } from "react";

function PlayerInfo({ playerNum, curPts, room }) {
  // Initialize default player names and pt values
  const [pNum, setPNum] = useState(-1);
  const [rPts, setRPts] = useState(0);
  const [rm, setRm] = useState("");

  useEffect(() => {
    if (playerNum) {
      // only set if prop is present
      setPNum(playerNum);
    }
    if (curPts) {
      console.log("curPts updated!");
      // only set if prop is present
      setRPts(curPts);
    }
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
