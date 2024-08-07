import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from './socket';

function HomePage() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate(); // useNavigate hook to get the navigate function

  const createRoom = () => {
    if (roomId === "") {
      alert("Room ID cannot be empty");
      return;
    }
    console.log(`Creating room ${roomId}`);
    // Change '/room/${roomId}' to your desired route
    navigate(`/room/${roomId}`);
  };

  const joinRoom = () => {
    if (roomId === "") {
      alert("Room ID cannot be empty");
      return;
    }
    console.log(`Joining room ${roomId}`);
    socket.emit("join", roomId);
  };

  return (
    <div className="homepage">
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={createRoom}>Create Room</button>
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default HomePage;
