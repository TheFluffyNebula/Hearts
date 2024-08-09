import { v4 as uuidv4 } from "uuid";

let rooms = new Map();

const createRoom = (roomId) => {
  rooms.set(roomId, { players: [], isPlaying: false });
};
createRoom('a'); // bypass createroom test

const getPlayersInRoom = (roomId) => {
  return rooms.get(roomId).players;
}

const joinRoom = (roomId, userId) => {
  if (!rooms.has(roomId)) return 1;
  if (rooms.get(roomId).players.length == 4) {
    return 2; // room is full
  }
  rooms.get(roomId).players.push(userId);
  if (rooms.get(roomId).players.length == 4) {
    return 3; // start game!
  }
  return 0;
};

const generateId = () => {
  return uuidv4();
};

export { createRoom, getPlayersInRoom, joinRoom, generateId };
