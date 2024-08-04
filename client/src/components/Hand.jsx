// Hand.jsx
import React from "react";
import { useState } from "react";
import CardSlot from "./CardSlot";

function Hand() {
  // Initialize the hand with 13 slots, with the first card as the 3 of Hearts
  const initArray = [];
  // initArray.push({ rank: "3", suit: "♥" });
  for (let i = 0; i < 13; i++) {
    initArray.push(null);
  }
  const [hand, setHand] = useState(initArray);

  return (
    <div className="hand">
      {hand.map((card, index) => (
        <CardSlot key={index} card={card} />
      ))}
    </div>
  );
}

export default Hand;
