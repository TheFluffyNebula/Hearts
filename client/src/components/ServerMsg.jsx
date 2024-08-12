import React from "react";
import { useState, useEffect } from "react";

function ServerMsg({ newMsg, playerMsg }) {
  const [msg, setMsg] = useState("Welcome!");
  const [pMsg, setPMsg] = useState("");

  useEffect(() => {
    if (newMsg) { // only set if prop is present
      setMsg(newMsg);
    }
    if (playerMsg) {
      setPMsg(playerMsg);
    }
  }, [newMsg, playerMsg]);

  return (
    <div className="server-msg">
      <p>{msg}</p>
      <p>{pMsg}</p>
    </div>
  );
}

export default ServerMsg;
