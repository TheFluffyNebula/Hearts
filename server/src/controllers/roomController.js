import { generateRoomId, addRoom, addPlayerToRoom, removePlayerFromRoom, getRoom } from '../utils/roomUtils.js';

const createRoom = (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const roomId = generateRoomId();
  addRoom(username, roomId);
  res.status(200).json({ roomId });
};

const joinRoom = (req, res) => {
  const { roomId, username } = req.body;
  if (!roomId || !username) {
    return res.status(400).json({ message: 'Room ID and username are required' });
  }

  if (!addPlayerToRoom(roomId, username)) {
    return res.status(400).json({ message: 'Room is full or username is taken' });
  }

  res.status(200).json({ success: true });
  req.io.to(roomId).emit('playerJoined', { username });
};

const leaveRoom = (req, res) => {
  const { roomId, username } = req.body;
  if (!roomId || !username) {
    return res.status(400).json({ message: 'Room ID and username are required' });
  }

  if (!removePlayerFromRoom(roomId, username)) {
    return res.status(400).json({ message: 'Failed to leave room' });
  }

  res.status(200).json({ success: true });
  req.io.to(roomId).emit('playerLeft', { username });
};

const startGame = (req, res) => {
  const { roomId, username } = req.body;
  if (!roomId || !username) {
    return res.status(400).json({ message: 'Room ID and username are required' });
  }

  const room = getRoom(roomId);
  if (!room || room.creator !== username) {
    return res.status(403).json({ message: 'Only the room creator can start the game' });
  }

  if (room.players.length !== 4) {
    return res.status(400).json({ message: 'Room must have exactly 4 players to start' });
  }

  room.gameStatus = 'started';
  res.status(200).json({ success: true });
  req.io.to(roomId).emit('gameStarted');
};

export { createRoom, joinRoom, leaveRoom, startGame };
