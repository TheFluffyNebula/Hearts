import * as roomUtils from "../utils/roomUtils.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("join", (roomId, userId) => {
      socket.join(roomId);
      const result = roomUtils.joinRoom(roomId, userId);
      io.emit("didJoin", result);
    });

    socket.onAny(() => {
      console.log("something happened");
    });
  });
};
