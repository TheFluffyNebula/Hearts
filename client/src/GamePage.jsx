import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import Hand from "./components/Hand";
import CenterCards from "./components/CenterCards";
import Scoreboard from "./components/Scoreboard";
import PlayerInfo from "./components/PlayerInfo";
import ServerMsg from "./components/ServerMsg";

function GamePage() {
  // Initialize the hand with 13 slots, with the first card as the 3 of Hearts
  const initArray = [];
  // initArray.push({ rank: "3", suit: "♥" });
  for (let i = 0; i < 13; i++) {
    initArray.push(null);
  }
  const [hand, setHand] = useState(initArray);
  const [playerNum, setPlayerNum] = useState(-1);
  const [serverMsg, setServerMsg] = useState("");

  useEffect(() => {
    function onDealHand(receivedHand) {
      console.log("[client] Hand received:", receivedHand);
      setHand(receivedHand);
      for (let i = 0; i < 13; i++) {
        // to implement the swap phase, move this into another component after 'swap' event
        if (receivedHand[i].suit === '♣' && receivedHand[i].value === '2') {
          // 2 of clubs goes first, let the server know which player has it
          socket.emit("twoClubs"); // server can see socket.id
        }
      }
    }

    function onPlayerNum(n) {
      // console.log(`You are player ${n}`)
      setPlayerNum(n);
    }

    function onServerMsg(msg) {
      console.log('new server message!');
      setServerMsg(msg);
    }

    socket.on("dealHand", onDealHand);
    socket.on("playerNum", onPlayerNum);
    socket.on("serverMsg", onServerMsg);

    return () => {
      socket.off("dealHand", onDealHand);
      socket.off("playerNum", onPlayerNum);
      socket.off("serverMsg", onServerMsg);
    };
  }, []);

  return (
    <div className="game-page">
      <CenterCards />
      <Hand cards={hand} />
      <PlayerInfo playerNum={playerNum} />
      <Scoreboard />
      <ServerMsg newMsg={serverMsg} />
    </div>
  );
}

export default GamePage;
