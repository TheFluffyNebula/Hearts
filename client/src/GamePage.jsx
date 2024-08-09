import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import Hand from "./components/Hand";
import CenterCards from "./components/CenterCards";
import Scoreboard from "./components/Scoreboard";
import PlayerInfo from "./components/PlayerInfo";

function GamePage() {
  // Initialize the hand with 13 slots, with the first card as the 3 of Hearts
  const initArray = [];
  // initArray.push({ rank: "3", suit: "♥" });
  for (let i = 0; i < 13; i++) {
    initArray.push(null);
  }
  const [hand, setHand] = useState(initArray);
  const [playerNum, setPlayerNum] = useState(-1);

  useEffect(() => {
    function onDealHand(receivedHand) {
      console.log("[client] Hand received:", receivedHand);
      setHand(receivedHand);
    }

    function onPlayerNum(n) {
      // console.log(`You are player ${n}`)
      setPlayerNum(n);
    }

    socket.on("dealHand", onDealHand);
    socket.on("playerNum", onPlayerNum);

    return () => {
      socket.off("dealHand", onDealHand);
      socket.off("playerNum", onPlayerNum);
    };
  }, []);

  return (
    <div className="game-page">
      <CenterCards />
      <Hand cards={hand} />
      <PlayerInfo playerNum={playerNum} />
      <Scoreboard />
    </div>
  );
}

export default GamePage;
