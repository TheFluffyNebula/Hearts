import { expect } from "chai";
import request from "supertest";
import ioc from "socket.io-client";

const serverUrl = "http://localhost:3001"; // Adjust to your server URL
let roomId;
let userId1;
let socket1;

describe("Room Management via HTTP", () => {
  before(() => {
    socket1 = ioc(serverUrl);
    socket1.on("connect", () => {
      console.log("socket 1 connected");
    });
  });

  it("should create a room and return roomId and userId", (done) => {
    request(serverUrl)
      .post("/api/rooms/create")
      .expect(200)
      .end((err, res) => {
        if (err) throw new Error(err);
        roomId = res.body.roomId;
        userId1 = res.body.userId;
        expect(roomId).to.be.a("string");
        expect(userId1).to.be.a("string");

        socket1.once("didJoin", (result) => {
          expect(result).to.equal(true);
          done();
        });
        socket1.emit("join", roomId, userId1);
      });
  });
});
