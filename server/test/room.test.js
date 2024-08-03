import { expect } from 'chai';
import request from 'supertest';

const serverUrl = 'http://localhost:3001'; // Adjust to your server URL
let roomId;

describe('Room Management API', () => {
  it('should create a room', (done) => {
    request(serverUrl)
      .post('/api/rooms')
      .send({ username: 'player1' })
      .expect(200)
      .expect((res) => {
        roomId = res.body.roomId;
        expect(roomId).to.be.a('string');
      })
      .end(done);
  });

  it('should allow a user to join a room', (done) => {
    request(serverUrl)
      .post('/api/rooms/join')
      .send({ roomId, username: 'player2' })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).to.be.true;
      })
      .end(done);
  });

  it('should allow a user to leave a room', (done) => {
    request(serverUrl)
      .post('/api/rooms/leave')
      .send({ roomId, username: 'player2' })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).to.be.true;
      })
      .end(done);
  });

  it('should not allow a user to join a full room', (done) => {
    // Add players to fill the room
    Promise.all([
      request(serverUrl).post('/api/rooms/join').send({ roomId, username: 'player3' }),
      request(serverUrl).post('/api/rooms/join').send({ roomId, username: 'player4' }),
      request(serverUrl).post('/api/rooms/join').send({ roomId, username: 'player5' })
    ])
    .then(() => {
      request(serverUrl)
        .post('/api/rooms/join')
        .send({ roomId, username: 'player6' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).to.equal('Room is full or username is taken');
        })
        .end(done);
    });
  });

  it('should allow the creator to start the game', (done) => {
    request(serverUrl)
      .post('/api/rooms/start')
      .send({ roomId, username: 'player1' })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).to.be.true;
      })
      .end(done);
  });

  it('should not allow non-creators to start the game', (done) => {
    request(serverUrl)
      .post('/api/rooms/start')
      .send({ roomId, username: 'player2' })
      .expect(403)
      .expect((res) => {
        expect(res.body.message).to.equal('Only the room creator can start the game');
      })
      .end(done);
  });
});
