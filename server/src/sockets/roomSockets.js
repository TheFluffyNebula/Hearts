import * as roomUtils from "../utils/roomUtils.js";
import { generateDeck } from "../utils/deck.js";

let hands = []
let center = [null, null, null, null] // center cards
// highest card variable?
let turn = -1

export default (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // creating a room doesn't require socket logic (?)
    // if one person in room after JOIN then trigger create logic

    socket.on("join", (roomId) => {
      socket.join(roomId);
      // Store roomId on the socket object
      socket.data.roomId = roomId;
      const result = roomUtils.joinRoom(roomId, socket.id);
      if (result == 0) {
        console.log('[server] room successfully joined!');
      } else if (result == 1) {
        console.log('[server] room does not exist')
      } else if (result == 2) {
        console.log('[server] room is already full')
      } else if (result == 3) {
        console.log('[server] final check!')
        // make sure the component is mounted so last joined
        // receives gets dealHand emit
        io.to(socket.id).emit("finalCheck", roomId);
        return; // don't go here twice
      }
      io.to(socket.id).emit("joinStatus", result, roomId);
    });

    socket.on("startGame", () => {
      // Generate and shuffle the deck
      const deck = generateDeck();

      // Get all players in the room
      const players = roomUtils.getPlayersInRoom(socket.data.roomId);
      const cardsPerPlayer = 13;

      // Distribute 13 cards to each player
      players.forEach((player, index) => {
        const hand = deck.slice(index * cardsPerPlayer, (index + 1) * cardsPerPlayer);
        hands[index] = hand;
        // Emit the hand to the specific player
        io.to(player).emit("dealHand", hand);
        // Emit the player number to the specific player
        io.to(player).emit("playerNum", index + 1);
      });
      // console.log(hands);

      console.log('[server] Cards dealt to players');
    });

    socket.on("twoClubs", () => {
      console.log(hands); // hands has 8 entries both times, not good
      // console.log("2 Clubs", socket.id);
      let idx = roomUtils.getPlayersInRoom(socket.data.roomId).indexOf(socket.id); // roomId accessible here???
      // console.log(idx);
      const newHand = roomUtils.playCard(
        hands[idx], { suit: '♣', value: '2' });
      // update the data with the new hand
      hands[idx] = newHand;
      // update the center cards
      center[0] = { suit: '♣', value: '2' };
      // console.log(center); // should be [{ suit: '♣', value: '2' }, null, null, null]
      turn = (idx + 1) % 4; // rotate between 0 1 2 3 (add 1 in server turn message)
      console.log("turn of player", turn + 1);
      // now, re-render center for everyone, newHand for only the person who played it
      // and finally the server message for whose turn it is
      // io.emit("updateCenter", center);
      console.log(center);
      io.emit("updateCenter", center);
      io.to(socket.id).emit("updateHand", newHand);
      io.emit("serverMsg", `Player ${turn + 1}'s Turn!`);
    });

    // socket.onAny(() => {
    //   console.log("something happened");
    // });
    
  });
};
