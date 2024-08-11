import React from "react";
// read-only
function CenterCardSlot({ card }) {
  return (
    <div className="center-card-slot">
      {card ? (
        <>
          <div className={`card-suit ${card.suit}`}>{card.suit}</div>
          <div className="card-rank">{card.value}</div>
        </>
      ) : (
        <div className="empty-slot">Empty</div>
      )}
    </div>
  );
}

export default CenterCardSlot;
