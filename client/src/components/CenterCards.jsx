import React from "react";
import { useState, useEffect } from "react";
import CardSlot from "./CardSlot";

function CenterCards( {c} ) {
  const [center, setCenter] = useState([null, null, null, null]);

  useEffect(() => {
    if (c) { // only set if prop is present
      setCenter(c);
    }
  }, [c]);

  return (
    <div className="center-cards">
      {center.map((card, index) => (
        <CardSlot key={index} card={card} />
      ))}
    </div>
  );
}

export default CenterCards;
