// Hand.jsx
import React from "react";
import { useState, useEffect } from "react";
import CardSlot from "./CardSlot";

function Hand({ cards }) {
  const [hand, setHand] = useState([]);

  useEffect(() => {
    if (cards) { // only set if prop is present
      setHand(cards);
    }
  }, [cards]);

  return (
    <div className="hand">
      {hand.map((card, index) => (
        <CardSlot key={index} card={card} />
      ))}
    </div>
  );
}

export default Hand;
