// Hand.jsx
import React from 'react';
import CardSlot from './CardSlot';

function Hand() {
  // Assuming we have 13 cards in hand
  return (
    <div className="hand">
      {Array.from({ length: 13 }).map((_, index) => (
        <CardSlot key={index} />
      ))}
    </div>
  );
}

export default Hand;
