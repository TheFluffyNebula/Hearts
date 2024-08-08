import * as roomUtils from "../utils/roomUtils.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // creating a room doesn't require socket logic (?)
    // if one person in room after JOIN then trigger create logic

    socket.on("join", (roomId) => {
      socket.join(roomId);
      const result = roomUtils.joinRoom(roomId, socket.id);
      if (result == 0) {
        console.log('[server] room successfully joined!');
      } else if (result == 1) {
        console.log('[server] room does not exist')
      } else if (result == 2) {
        console.log('[server] room is already full!')
      } else if (result == 3) {
        // TODO: server side already, start game logic (deal hand)
        // TODO: Emit event to client side to let players know game is starting
      }
      io.emit("joinStatus", result, roomId);
    });

    // socket.onAny(() => {
    //   console.log("something happened");
    // });
  });
};
