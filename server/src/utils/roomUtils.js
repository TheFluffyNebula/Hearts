const rooms = new Map(); // Map to store rooms with roomId as key

const generateRoomId = () => Math.random().toString(36).substring(2, 9);

const addRoom = (creator, roomId) => {
  rooms.set(roomId, {
    creator,
    players: [{ username: creator, id: generateRoomId() }],
    gameStatus: 'waiting', // could be 'waiting', 'started', etc.
  });
};

const removeRoom = (roomId) => {
  rooms.delete(roomId);
};

const getRoom = (roomId) => {
  return rooms.get(roomId);
};

const isUsernameTaken = (roomId, username) => {
  const room = getRoom(roomId);
  if (!room) return false;
  return room.players.some(player => player.username === username);
};

const addPlayerToRoom = (roomId, username) => {
  const room = getRoom(roomId);
  if (room && room.players.length < 4 && !isUsernameTaken(roomId, username)) {
    room.players.push({ username, id: generateRoomId() });
    return true;
  }
  return false;
};

const removePlayerFromRoom = (roomId, username) => {
  const room = getRoom(roomId);
  if (room) {
    room.players = room.players.filter(player => player.username !== username);
    if (room.players.length === 0) {
      removeRoom(roomId);
    }
    return true;
  }
  return false;
};

export {
  generateRoomId,
  addRoom,
  removeRoom,
  getRoom,
  isUsernameTaken,
  addPlayerToRoom,
  removePlayerFromRoom,
};
