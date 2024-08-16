import * as roomUtils from "../utils/roomUtils.js";
import { generateDeck } from "../utils/deck.js";

// roomsData
const rD = {}; // Object to store room-specific data

// // cards to render
// let hands = []
// let center = [null, null, null, null] // center cards
// // gameplay elements
// let started = false;
// let heartbreak = false;
// let turn = -1
// let totalPts = [0, 0, 0, 0]
// // reset these values to these after each round
// let curPts = [0, 0, 0, 0]
// let suit = "♣" // 2 of clubs automatically played
// let highestValue = 0 // base value, easy to tell first player
// let highestId = "" // emit the points to the winner

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
        
        // here is a good spot to setup the room-specific data
        rD[roomId] = {
          // Cards to render
          hands: [], // Hands for each player
          center: [null, null, null, null], // Center cards
  
          // Gameplay elements
          started: false, // Game start status
          heartbreak: false, // Heartbreak status
          turn: -1, // Whose turn it is
          totalPts: [0, 0, 0, 0], // Total points for each player
  
          // Round-specific variables (reset after each round)
          curPts: [0, 0, 0, 0], // Current points for this round
          suit: "♣", // Initial suit (2 of clubs played first)
          highestValue: 0, // Highest value of the card in the current trick
          highestId: "", // ID of the player with the highest card in the current trick
        };
        return; // don't go here twice
      }
      // console.log("emitting joinStatus");
      io.to(socket.id).emit("joinStatus", result, roomId);
    });

    socket.on("startGame", () => {
      const rId = socket.data.roomId;
      // let the client know the room id
      io.to(rId).emit("roomId", rId);

      // Generate and shuffle the deck
      const deck = generateDeck();

      // Get all players in the room
      const players = roomUtils.getPlayersInRoom(rId);
      const cardsPerPlayer = 13;

      let firstPlayer = -1; // make the 2 of clubs border glow green for the first player
      let cardLoc = -1; // 2 of clubs index in the hand
      // Distribute 13 cards to each player
      players.forEach((player, index) => {
        const hand = deck.slice(index * cardsPerPlayer, (index + 1) * cardsPerPlayer);
        rD[rId].hands[index] = hand;
        // Emit the hand to the specific player
        io.to(player).emit("dealHand", hand);
        // Emit the player number to the specific player
        io.to(player).emit("playerNum", index + 1);
        const twoOfClubsIdx = hand.findIndex(obj => obj.suit === "♣" && obj.value == 2);
        if (twoOfClubsIdx !== -1) {
          firstPlayer = player;
          cardLoc = twoOfClubsIdx;
        }
      });
      // console.log(hands);
      console.log('[server] Cards dealt to players');
      // now make the two of clubs glow green for the first player
      let validCards = new Array(13).fill(false);
      validCards[cardLoc] = true;
      setTimeout(() => {
        // console.log(validCards);
        io.to(firstPlayer).emit("validCards", validCards);
      }, 500);
    });

    // 3 cases: first card (set suit), middle card (check suit), last card ()
    // TODO: implement breaking into hearts
    socket.on("playCard", (card) => {
      const rId = socket.data.roomId;
      const players = roomUtils.getPlayersInRoom(rId);
      const playerIdx = players.indexOf(socket.id);
      let possibleHighest = true;
      if (!rD[rId].started) {
        if (card.suit == "♣" && card.value == "2") {
          rD[rId].started = true;
          rD[rId].turn = playerIdx;
        } else {
          // console.log("Must start with 2 of clubs!");
          io.to(socket.id).emit("playerMsg", "Must start with 2 of clubs!");
          return;
        }
      } else {
        // first check if the turn is valid
        // turn correctly stores whose turn it is so compare turn and players.indexOf(socket.id)
        if (rD[rId].turn != playerIdx) {
          // console.log("It's not your turn!");
          io.to(socket.id).emit("playerMsg", "It's not your turn!");
          return;
        }
        // include common check: suit
        if (rD[rId].suit == "" && !rD[rId].heartbreak && card.suit == "♥") {
          // edge case: player only has hearts left, check for non-hearts cards
          for (let i = 0; i < 13; i++) {
            if (rD[rId].hands[playerIdx][i] && rD[rId].hands[playerIdx][i].suit != "♥") {
              // console.log("Hearts not broken yet!");
              io.to(socket.id).emit("playerMsg", "Hearts not broken yet!");
              return;
            }
          }
        }
        if (rD[rId].suit != "" && card.suit != rD[rId].suit) { // established suit + not matching
          for (let i = 0; i < 13; i++) { // check for has suit
            if (rD[rId].hands[playerIdx][i] && rD[rId].hands[playerIdx][i].suit == rD[rId].suit) {
              // console.log("Play the suit if you have it.");
              io.to(socket.id).emit("playerMsg", "Play the suit if you have it.");
              return;
            }
          }
          // player doesn't have the suit, can break hearts
          if (card.suit == "♥") rD[rId].heartbreak = true;
          // not the suit but still valid, can't be highest though
          possibleHighest = false;
        }
      }
      // valid turn, let's go!
      // clear the green glows and set individually later
      let validCards = new Array(13).fill(false);
      io.to(rId).emit("validCards", validCards);
      // common operation: play card
      const newHand = roomUtils.playCard(
        rD[rId].hands[playerIdx], card);
      // update the data with the new hand
      rD[rId].hands[playerIdx] = newHand;
      // differences: information changed, actions
      if (rD[rId].center[0] == null) { // CASE 1: first card played
        // console.log(rD[rId])
        rD[rId].turn = (rD[rId].turn + 1) % 4;
        rD[rId].center[0] = card;
        rD[rId].suit = card.suit;
        rD[rId].highestValue = CARD_VALUE_MAP[card.value];
        rD[rId].highestId = socket.id;
      } else if (rD[rId].center[2] == null) { // CASE 2: middle card (3rd card hasn't been played)
        rD[rId].turn = (rD[rId].turn + 1) % 4;
        if (rD[rId].center[1] == null) {
          rD[rId].center[1] = card;
        } else {
          rD[rId].center[2] = card;
        }
        if (possibleHighest && CARD_VALUE_MAP[card.value] > rD[rId].highestValue) {
          rD[rId].highestValue = CARD_VALUE_MAP[card.value];
          rD[rId].highestId = socket.id;
        }
      } else { // CASE 3: last card
        rD[rId].center[3] = card;
        if (possibleHighest && CARD_VALUE_MAP[card.value] > rD[rId].highestValue) {
          rD[rId].highestValue = CARD_VALUE_MAP[card.value];
          rD[rId].highestId = socket.id;
        }
        // last card played, calculate scoring
        let roundPts = 0;
        for (let i = 0; i < 4; i++) {
          if (rD[rId].center[i].suit == '♥') {
            roundPts += 1;
          }
          if (rD[rId].center[i].suit == '♠' && rD[rId].center[i].value == 'Q') {
            roundPts += 13;
          }
        }
        // console.log(roundPts); // should be 0 for clubs round unless someone has a heart
        // update scores -- immediately for curRound and later for total vars?
        const winnerIdx = roomUtils.getPlayersInRoom(rId).indexOf(rD[rId].highestId)
        rD[rId].curPts[winnerIdx] += roundPts;
        // update the winner's round pts
        io.to(rD[rId].highestId).emit("roundUpdate", rD[rId].curPts[winnerIdx]);

        // if the last card is gone add to totals and re-render those
        if (rD[rId].hands[0].every(element => element === null)) {
          // check if someone shot the moon
          if (Math.max(...rD[rId].curPts) == 26) {
            for (let i = 0; i < 4; i++) {
              if (rD[rId].curPts[i] != 26) {
                rD[rId].totalPts[i] += 26;
              }
            }
          } else {
            for (let i = 0; i < 4; i++) {
              // update each person's totalPts based on their roundPts
              rD[rId].totalPts[i] += rD[rId].curPts[i];
              rD[rId].curPts[i] = 0; // reset the value
            }
          }
          // update scoreboard for everyone
          io.to(rId).emit("scoreboardUpdate", rD[rId].totalPts);
          rD[rId].curPts = [0, 0, 0, 0]

          for (let i = 0; i < 4; i++) {
            io.to(players[i]).emit("roundUpdate", rD[rId].curPts[i]);
          }

          io.to(rId).emit("updateCenter", rD[rId].center);
          io.to(socket.id).emit("updateHand", newHand);
          setTimeout(() => {
          // if someone is above x pts, end game & lowest amt wins
            if (Math.max(...rD[rId].totalPts) > 20) { // 10/20 right now for testing (1-2 rounds), normally 75/100
              io.to(rId).emit("serverMsg", 'Game Over, lowest score wins!');
            } else { // start the next round
              // started & turn get reset from started=false
              rD[rId].center = [null, null, null, null];
              rD[rId].started = false;
              rD[rId].heartbreak = false;
              rD[rId].suit = "♣"
              rD[rId].highestValue = 0;
              rD[rId].highestId = "";
              io.to(rId).emit("updateCenter", rD[rId].center);
              io.to(rId).emit("roundUpdate", 0);
              io.to(rId).emit("serverMsg", 'Round over!');
              io.to(rId).emit("nextRound");
            }
          }, 2000);
          return;
        }
        io.to(rId).emit("updateCenter", rD[rId].center);
        io.to(socket.id).emit("updateHand", newHand);
        // don't let anyone play while showing last card
        rD[rId].turn = -1
        // reset the variables
        setTimeout(() => {
          rD[rId].center = [null, null, null, null];
          rD[rId].turn = winnerIdx;
          rD[rId].suit = "";
          rD[rId].highestValue = 0;
          rD[rId].highestId = "";
          io.to(rId).emit("updateCenter", rD[rId].center);
          io.to(rId).emit("serverMsg", `Player ${rD[rId].turn + 1}'s Turn!`);
          // if hearts not broken, must play non-heart. else: all non-empty slots are valid
          validCards = new Array(13).fill(false);
          const playerHand = rD[rId].hands[rD[rId].turn];
          if (rD[rId].heartbreak) { // hearts broken, all non-empty slots are valid
            playerHand.forEach((card, index) => {
              if (card !== null) {
                validCards[index] = true;
              }
            });
          } else {
            playerHand.forEach((card, index) => {
              if (card !== null && card?.suit !== '♥') {
                validCards[index] = true;
              }
            });
          }
          io.to(players[rD[rId].turn]).emit("validCards", validCards);
        }, 2000);
        return;
      }
      // update after turn
      io.to(rId).emit("updateCenter", rD[rId].center);
      io.to(socket.id).emit("updateHand", newHand);
      io.to(rId).emit("serverMsg", `Player ${rD[rId].turn + 1}'s Turn!`);
      // if have suit, must play. else, all non-empty slots are valid
      validCards = new Array(13).fill(false);
      const hasSuitIdx = rD[rId].hands[rD[rId].turn].findIndex(obj => obj && obj.suit == rD[rId].suit);
      const playerHand = rD[rId].hands[rD[rId].turn];
      if (hasSuitIdx == -1) { // suit not present, all non-empty slots are valid
        playerHand.forEach((card, index) => {
          if (card !== null) {
            validCards[index] = true;
          }
        });
      } else {
        playerHand.forEach((card, index) => {
          if (card !== null && card?.suit === rD[rId].suit) {
            validCards[index] = true;
          }
        });
      }
      io.to(players[rD[rId].turn]).emit("validCards", validCards);
    })

    // socket.onAny(() => {
    //   console.log("something happened");
    // });
    
  });
};
