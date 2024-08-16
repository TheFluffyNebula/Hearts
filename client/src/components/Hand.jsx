// Hand.jsx
import React from "react";
import { useState, useEffect } from "react";
import HandCardSlot from "./HandCardSlot";

function Hand({ cards, onCardClick, validCards }) {
  const [hand, setHand] = useState([]);
  // PLAN: after turn is over, send all false to reset
  // could do roomwide all false then set one indiv. to show valid cards
  // extra renders but no need to keep track of who just went
  let initValid = new Array(13).fill(false);
  const [validC, setValidC] = useState(initValid);

  useEffect(() => {
    if (cards) { // only set if prop is present
      setHand(cards);
    }
    if (validCards) {
      setValidC(validCards);
    }
  }, [cards, validCards]);

  return (
    <div className="hand">
      {hand.map((card, index) => (
        <HandCardSlot 
        key={index} 
        card={card}
        onClick={() => onCardClick(card)}
        valid={validC[index]}
        />
      ))}
    </div>
  );
}

export default Hand;
