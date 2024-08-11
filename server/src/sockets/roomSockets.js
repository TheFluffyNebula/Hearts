import * as roomUtils from "../utils/roomUtils.js";
import { generateDeck } from "../utils/deck.js";

// cards to render
let hands = []
let center = [null, null, null, null] // center cards
// gameplay elements
let turn = -1
let totalPts = [0, 0, 0, 0]
// reset these values to these after each round
let curPts = [0, 0, 0, 0]
let suit = "♣" // 2 of clubs automatically played
let highestValue = 0 // base value, easy to tell first player
let highestId = "" // emit the points to the winner
// keep it simple 2 = 2, J = 11, A = 14
const CARD_VALUE_MAP = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
}

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

    socket.on("twoClubs", () => { // takes care of the very first card
      // console.log(hands); // hands has 8 entries both times, not good
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
      // console.log(center);
      io.emit("updateCenter", center);
      io.to(socket.id).emit("updateHand", newHand);
      io.emit("serverMsg", `Player ${turn + 1}'s Turn!`);
    });

    // 3 cases: first card (set suit), middle card (check suit), last card ()
    // TODO: implement breaking into hearts
    socket.on("playCard", (card) => {
      // first check if the turn is valid
      // turn correctly stores whose turn it is so compare turn and players.indexOf(socket.id)
      // include common check: suit
      const players = roomUtils.getPlayersInRoom(socket.data.roomId);
      const playerIdx = players.indexOf(socket.id);
      if (turn != playerIdx) {
        console.log("It's not your turn!");
        return;
      }
      if (suit != "" && card.suit != suit) { // established suit + not matching
        console.log("Play the suit if you have it.");
        return;
      }
      // valid suit, valid turn, let's go!
      // common operation: play card
      const newHand = roomUtils.playCard(
        hands[playerIdx], card);
      // update the data with the new hand
      hands[playerIdx] = newHand;
      // differences: information changed, actions
      if (suit == "") { // CASE 1: first card played
        turn = (turn + 1) % 4;
        center[0] = card;
        suit = card.suit;
        highestValue = CARD_VALUE_MAP[card.value];
        highestId = socket.id;
      } else if (center[2] == null) { // CASE 2: middle card (3rd card hasn't been played)
        turn = (turn + 1) % 4;
        if (center[1] == null) {
          center[1] = card;
        } else {
          center[2] = card;
        }
        if (CARD_VALUE_MAP[card.value] > highestValue) {
          highestValue = CARD_VALUE_MAP[card.value];
          highestId = socket.id;
        }
      } else { // CASE 3: last card
        center[3] = card;
        if (CARD_VALUE_MAP[card.value] > highestValue) {
          highestValue = CARD_VALUE_MAP[card.value];
          highestId = socket.id;
        }
        // last card played, calculate scoring
        let roundPts = 0;
        for (let i = 0; i < 4; i++) {
          if (center[i].suit == '♥') {
            roundPts += 1;
          }
          if (center[i].suit == '♠' && center[i].value == 'Q') {
            roundPts += 13;
          }
        }
        console.log(roundPts); // should be 0 for clubs round unless someone has a heart
        // update scores -- immediately for curRound and later for total vars?
        const winnerIdx = roomUtils.getPlayersInRoom(socket.data.roomId).indexOf(highestId)
        curPts[winnerIdx] += roundPts;
        // update the winner's round pts
        io.to(highestId).emit("roundUpdate", curPts[winnerIdx]);

        // if the last card is gone add to totals and re-render those
        if (hands[0].every(element => element === null)) {
          for (let i = 0; i < 4; i++) {
            // update each person's totalPts based on their roundPts
            totalPts[i] += curPts[i];
            curPts[i] = 0; // reset the value
          }
          // update scoreboard for everyone
          io.emit("scoreboardUpdate", totalPts);
          // if someone is above 50 pts, end game & amt wins
        }

        // reset the variables
        turn = winnerIdx;
        center = [null, null, null, null];
        suit = "";
        highestValue = 0;
        highestId = "";
      }
      // same set of updates
      io.emit("updateCenter", center);
      io.to(socket.id).emit("updateHand", newHand);
      io.emit("serverMsg", `Player ${turn + 1}'s Turn!`);
    })

    // socket.onAny(() => {
    //   console.log("something happened");
    // });
    
  });
};
