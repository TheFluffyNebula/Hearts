import { randomBytes } from 'crypto';

const rooms = {};

const addRoom = (roomId, roomData) => {
  rooms[roomId] = roomData;
};

const removeRoom = (roomId) => {
  delete rooms[roomId];
};

const getRoom = (roomId) => rooms[roomId];

const generateRoomId = () => {
  return randomBytes(3).toString('hex').toUpperCase(); // Generates a 6-character room ID
};

const isUsernameTaken = (roomId, username) => {
    const room = getRoom(roomId);
    if (!room) return false;
    return room.players.some(player => player.username === username);
  };

export { addRoom, removeRoom, getRoom, generateRoomId, isUsernameTaken };
