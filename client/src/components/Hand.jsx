// Hand.jsx
import React from "react";
import { useState, useEffect } from "react";
import HandCardSlot from "./HandCardSlot";

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
        <HandCardSlot key={index} card={card} />
      ))}
    </div>
  );
}

export default Hand;
