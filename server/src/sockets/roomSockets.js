import * as roomUtils from "../utils/roomUtils.js";
import { generateDeck } from "../utils/deck.js";

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
        console.log('[server] room is already full')
      } else if (result == 3) {
        console.log('[server] game starting!')
        // make sure the component is mounted so last joined
        // receives gets dealHand emit
        io.emit("joinStatus", result, roomId); 
        // Generate and shuffle the deck
        const deck = generateDeck();

        // Get all players in the room
        const players = roomUtils.getPlayersInRoom(roomId);
        const cardsPerPlayer = 13;

        // Distribute 13 cards to each player
        players.forEach((player, index) => {
          const hand = deck.slice(index * cardsPerPlayer, (index + 1) * cardsPerPlayer);

          // Emit the hand to the specific player
          io.to(player).emit("dealHand", hand);
        });

        console.log('[server] Cards dealt to players');
        return; // emitted joinStatus early
      }
      io.emit("joinStatus", result, roomId);
    });

    // socket.onAny(() => {
    //   console.log("something happened");
    // });
  });
};
