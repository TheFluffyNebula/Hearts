import React from "react";

function CardSlot({ card }) {
  return (
    <div className="card-slot">
      {card ? (
        <>
          <div className={`card-suit ${card.suit}`}>{card.suit}</div>
          <div className="card-rank">{card.rank}</div>
        </>
      ) : (
        <div className="empty-slot">Empty</div>
      )}
    </div>
  );
}

export default CardSlot;
