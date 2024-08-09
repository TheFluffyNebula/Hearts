import React from "react";
import { useState, useEffect } from "react";

function ServerMsg({ newMsg }) {
  const [msg, setMsg] = useState("Welcome!");

  useEffect(() => {
    if (newMsg) { // only set if prop is present
      setMsg(newMsg);
    }
  }, [newMsg]);

  return (
    <div className="server-msg">
      {msg}
    </div>
  );
}

export default ServerMsg;
