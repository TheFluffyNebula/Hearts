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
  const [center, setCenter] = useState([null, null, null, null])
  const [playerNum, setPlayerNum] = useState(-1);
  const [serverMsg, setServerMsg] = useState("");
  const [playerMsg, setPlayerMsg] = useState("");
  const [curPts, setCurPts] = useState(0);
  const [totalPts, setTotalPts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    function onDealHand(receivedHand) {
      console.log("[client] Hand received:", receivedHand);
      setHand(receivedHand);
    }

    function onPlayerNum(n) {
      // console.log(`You are player ${n}`)
      setPlayerNum(n);
    }

    function onServerMsg(msg) {
      // console.log('new server message!');
      setServerMsg(msg);
    }

    function onPlayerMsg(msg) {
      setPlayerMsg(msg);
    }

    function onUpdateHand(newHand) {
      // console.log('hand updated!');
      setHand(newHand);
    }

    function onUpdateCenter(newCenter) {
      // console.log('center updated');
      setCenter(newCenter);
    }

    function onRoundUpdate(rPts) {
      setCurPts(rPts);
    }

    function onScoreboardUpdate(tPts) {
      setTotalPts(tPts);
    }

    // socket.on("roomId")
    socket.on("dealHand", onDealHand);
    socket.on("playerNum", onPlayerNum);
    socket.on("serverMsg", onServerMsg);
    socket.on("playerMsg", onPlayerMsg);
    socket.on("updateHand", onUpdateHand);
    socket.on("updateCenter", onUpdateCenter);
    socket.on("roundUpdate", onRoundUpdate);
    socket.on("scoreboardUpdate", onScoreboardUpdate);
    return () => {
      socket.off("dealHand", onDealHand);
      socket.off("playerNum", onPlayerNum);
      socket.off("serverMsg", onServerMsg);
      socket.off("playerMsg", onPlayerMsg);
      socket.off("updateHand", onUpdateHand);
      socket.off("updateCenter", onUpdateCenter);
      socket.off("roundUpdate", onRoundUpdate);
      socket.off("scoreboardUpdate", onScoreboardUpdate);
    };
  }, []);

  const handleCardClick = (card) => {
    // check if the card is empty (avoid null pointer access)
    if (card == null) {
      console.log("No card here!");
      return;
    }
    console.log(`Card clicked: ${card.suit} ${card.value}`);
    // Emit playCard
    socket.emit("playCard", card);
  };

  return (
    <div className="game-page">
      <CenterCards c={center} />
      <Hand cards={hand} onCardClick={handleCardClick} />
      <PlayerInfo playerNum={playerNum} curPts={curPts} />
      <Scoreboard totalPts={totalPts} />
      <ServerMsg newMsg={serverMsg} playerMsg={playerMsg} />
    </div>
  );
}

export default GamePage;
