import { expect } from 'chai';
import request from 'supertest';

const serverUrl = 'http://localhost:3001'; // Adjust to your server URL
let roomId;
let userId1;
let userId2;

describe('Room Management via HTTP', () => {
  it('should create a room and return roomId and userId', (done) => {
    request(serverUrl)
      .post('/api/rooms/create')
      .send({})
      .expect(200)
      .expect((res) => {
        roomId = res.body.roomId;
        userId1 = res.body.userId;
        expect(roomId).to.be.a('string');
        expect(userId1).to.be.a('string');
      })
      .end(done);
  });
});
