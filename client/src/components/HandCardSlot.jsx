import React from "react";
// attach listeners
function HandCardSlot({ card, onClick }) {
  return (
    <div className="hand-card-slot" onClick={onClick}>
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

export default HandCardSlot;
