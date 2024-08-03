import React from 'react';
import { useState } from 'react';
import CardSlot from './CardSlot';

function CenterCards() {
  const initArray = []
  for (let i = 0; i < 4; i++) {
    initArray.push(null)
  }
  const [hand, setHand] = useState(initArray);

  return (
    <div className="center-cards">
      {hand.map((card, index) => (
        <CardSlot key={index} card={card} />
      ))}
    </div>
  );
}

export default CenterCards;
