import { generateRoomId, addRoom, removeRoom, getRoom, isUsernameTaken } from '../utils/roomUtils.js';

const createRoom = (req, res) => {
  const { username } = req.body || {};
  
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  const roomId = generateRoomId();
  addRoom(roomId, {
    players: [{ id: null, username }],
    ready: false,
  });
  res.json({ roomId });
};

const joinRoom = (req, res) => {
  const { roomId, username } = req.body || {};
  
  if (!roomId || !username) {
    return res.status(400).json({ success: false, message: 'Room ID and username are required' });
  }

  const room = getRoom(roomId);
  
  if (!room) {
    return res.status(400).json({ success: false, message: 'Room does not exist' });
  }

  if (isUsernameTaken(roomId, username)) {
    return res.status(400).json({ success: false, message: 'Username is already taken in this room' });
  }

  if (room.players.length < 4) {
    room.players.push({ id: null, username });
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Room is full' });
  }
};

const leaveRoom = (req, res) => {
  const { roomId } = req.body || {};
  
  if (!roomId) {
    return res.status(400).json({ success: false, message: 'Room ID is required' });
  }

  removeRoom(roomId);
  res.json({ success: true });
};

const startGame = (req, res) => {
  const { roomId } = req.body || {};
  
  if (!roomId) {
    return res.status(400).json({ success: false, message: 'Room ID is required' });
  }

  const room = getRoom(roomId);
  if (room && room.players.length === 4) {
    room.ready = true;
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Room must have exactly 4 players to start' });
  }
};

export { createRoom, joinRoom, leaveRoom, startGame };
