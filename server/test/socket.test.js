import { expect } from 'chai';
import io from 'socket.io-client';
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const ioServer = new Server(server);

let rooms = {}; // In-memory rooms store for testing

ioServer.on('connection', (socket) => {
  socket.on('createRoom', (username, callback) => {
    const roomId = `room-${Math.random().toString(36).slice(2, 11)}`;
    rooms[roomId] = { players: [{ id: socket.id, username }] };
    socket.join(roomId);
    callback({ success: true, roomId });
    ioServer.emit('roomCreated', roomId); // Broadcast room creation
  });

  socket.on('joinRoom', (roomId, username, callback) => {
    if (rooms[roomId]) {
      rooms[roomId].players.push({ id: socket.id, username });
      socket.join(roomId);
      ioServer.to(roomId).emit('playerJoined', rooms[roomId].players);
      callback({ success: true });
    } else {
      callback({ success: false, error: 'Room does not exist' });
    }
  });

  socket.on('leaveRoom', (roomId, username, callback) => {
    if (rooms[roomId]) {
      rooms[roomId].players = rooms[roomId].players.filter(player => player.id !== socket.id);
      socket.leave(roomId);
      ioServer.to(roomId).emit('playerLeft', rooms[roomId].players);
      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
      }
      callback({ success: true });
    } else {
      callback({ success: false, error: 'Room does not exist' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000);

describe('Socket.IO Room Management', () => {
  let clientSocket1, clientSocket2;

  before((done) => {
    clientSocket1 = io.connect('http://localhost:3000');
    clientSocket2 = io.connect('http://localhost:3000');
    clientSocket1.on('connect', () => clientSocket2.on('connect', done));
  });

  after(() => {
    clientSocket1.disconnect();
    clientSocket2.disconnect();
    ioServer.close();
  });

  it('should handle successful room creation', (done) => {
    clientSocket1.emit('createRoom', 'player1', (response) => {
      expect(response).to.have.property('success', true);
      expect(response).to.have.property('roomId');
      done();
    });
  });

  it('should handle room already exists scenario', (done) => {
    clientSocket1.emit('createRoom', 'player1', (response) => {
      const existingRoomId = response.roomId;
      clientSocket2.emit('createRoom', 'player2', (response) => {
        expect(response).to.have.property('success', true);
        expect(response.roomId).to.not.equal(existingRoomId);
        done();
      });
    });
  });

  it('should handle successful join', (done) => {
    clientSocket1.emit('createRoom', 'player1', (response) => {
      const roomId = response.roomId;
      clientSocket2.emit('joinRoom', roomId, 'player2', (response) => {
        expect(response).to.have.property('success', true);
        done();
      });
    });
  });

  it('should handle joining a non-existing room', (done) => {
    clientSocket2.emit('joinRoom', 'nonExistingRoom', 'player2', (response) => {
      expect(response).to.have.property('success', false);
      expect(response).to.have.property('error', 'Room does not exist');
      done();
    });
  });

  it('should handle successful leave', (done) => {
    clientSocket1.emit('createRoom', 'player1', (response) => {
      const roomId = response.roomId;
      clientSocket2.emit('joinRoom', roomId, 'player2', (response) => {
        clientSocket2.emit('leaveRoom', roomId, 'player2', (response) => {
          expect(response).to.have.property('success', true);
          done();
        });
      });
    });
  });

  it('should handle leaving a non-existing room', (done) => {
    clientSocket2.emit('leaveRoom', 'nonExistingRoom', 'player2', (response) => {
      expect(response).to.have.property('success', false);
      expect(response).to.have.property('error', 'Room does not exist');
      done();
    });
  });

  it('should handle multiple simultaneous joins', (done) => {
    clientSocket1.emit('createRoom', 'player1', (response) => {
      const roomId = response.roomId;
  
      // Create a function to handle the join response
      const handleJoinResponse = (socket, username) => {
        return new Promise((resolve) => {
          socket.emit('joinRoom', roomId, username, (response) => {
            expect(response).to.have.property('success', true);
            resolve();
          });
        });
      };
  
      // Connect the second client
      const socket2 = io.connect('http://localhost:3000');
      const socket3 = io.connect('http://localhost:3000');
  
      // Track completion of all join operations
      Promise.all([
        new Promise((resolve) => socket2.on('connect', () => resolve(handleJoinResponse(socket2, 'player2')))),
        new Promise((resolve) => socket3.on('connect', () => resolve(handleJoinResponse(socket3, 'player3'))))
      ])
      .then(() => done())
      .catch(done);
    });
  });  

  it('should handle multiple simultaneous leaves', (done) => {
    clientSocket1.emit('createRoom', 'player1', (response) => {
      const roomId = response.roomId;
      clientSocket2.emit('joinRoom', roomId, 'player2', (response) => {
        const concurrentLeaves = [clientSocket1, clientSocket2];

        let leaveCount = 0;
        concurrentLeaves.forEach((socket) => {
          socket.emit('leaveRoom', roomId, `player${leaveCount + 1}`, (response) => {
            expect(response).to.have.property('success', true);
            leaveCount += 1;
            if (leaveCount === concurrentLeaves.length) {
              done();
            }
          });
        });
      });
    });
  });
});
