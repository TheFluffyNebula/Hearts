import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import Hand from "./components/Hand";
import CenterCards from "./components/CenterCards";
import Scoreboard from "./components/Scoreboard";

function GamePage() {
  // Initialize the hand with 13 slots, with the first card as the 3 of Hearts
  const initArray = [];
  // initArray.push({ rank: "3", suit: "♥" });
  for (let i = 0; i < 13; i++) {
    initArray.push(null);
  }
  const [hand, setHand] = useState(initArray);

  useEffect(() => {
    function onDealHand(receivedHand) {
      console.log("[client] Hand received:", receivedHand);
      setHand(receivedHand);
    }

    socket.on("dealHand", onDealHand);

    return () => {
      socket.off("dealHand", onDealHand);
    };
  }, []);

  return (
    <div className="game-page">
      <CenterCards />
      <Hand cards={hand} />
      <Scoreboard />
    </div>
  );
}

export default GamePage;
