import { generateRoomId, addRoom, removeRoom, getRoom, isUsernameTaken } from '../utils/roomUtils.js';

const roomSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (roomId, username, callback) => {
      if (!username || !roomId) {
        return callback({ success: false, message: 'Room ID and username are required' });
      }

      const room = getRoom(roomId);

      if (!room) {
        return callback({ success: false, message: 'Room does not exist' });
      }

      if (isUsernameTaken(roomId, username)) {
        return callback({ success: false, message: 'Username is already taken in this room' });
      }

      if (room.players.length < 4) {
        room.players.push({ id: socket.id, username });
        socket.join(roomId);
        io.to(roomId).emit('playerJoined', room.players);
        callback({ success: true });
      } else {
        callback({ success: false, message: 'Room is full' });
      }
    });

    socket.on('leaveRoom', (roomId) => {
      const room = getRoom(roomId);
      if (room) {
        room.players = room.players.filter(player => player.id !== socket.id);
        socket.leave(roomId);
        io.to(roomId).emit('playerLeft', room.players);

        if (room.players.length === 0) {
          removeRoom(roomId);
        }
      }
    });

    socket.on('startGame', (roomId) => {
      const room = getRoom(roomId);
      if (room && room.players.length === 4) {
        room.ready = true;
        io.to(roomId).emit('gameStarted');
      } else {
        io.to(roomId).emit('startGameError', 'Room must have exactly 4 players to start');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

export default roomSockets;
