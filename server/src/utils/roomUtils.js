import { v4 as uuidv4 } from "uuid";

let rooms = new Map();

const createRoom = (roomId) => {
  rooms.set(roomId, { players: [], isPlaying: false });
};

const joinRoom = (roomId, userId) => {
  if (!rooms.has(roomId)) return false;
  rooms.get(roomId).players.push(userId);
  return true;
};

const generateId = () => {
  return uuidv4();
};

export { createRoom, joinRoom, generateId };
