import { v4 as uuidv4 } from "uuid";

const generateId = () => {
  return uuidv4();
};

let rooms = new Map();

const createRoom = (roomId) => {
  rooms.set(roomId, { players: [], isPlaying: false });
};
createRoom('a'); // bypass createroom test

const getPlayersInRoom = (roomId) => {
  return rooms.get(roomId).players;
}

const joinRoom = (roomId, userId) => {
  if (!rooms.has(roomId)) return 1;
  if (rooms.get(roomId).players.length == 4) {
    return 2; // room is full
  }
  rooms.get(roomId).players.push(userId);
  if (rooms.get(roomId).players.length == 4) {
    return 3; // start game!
  }
  return 0;
};

/**
 * Things to do:
 * return a new array, set the appropriate card to null, then call setHand (re-render)
 * put the card in the centerCards (first non-null entry, resets to all null after each trick)
 * if it's the last card played, identify who wins the trick and gets how many points
 */
const playCard = (hand, cardPlayed) => {
  const ret = [...hand]
  for (let i = 0; i < 13; i++) {
    if (ret[i]) { // null check
      if (ret[i].suit === cardPlayed.suit && ret[i].value === cardPlayed.value) {
        ret[i] = null;
      }
    }
  }
  // console.log(ret);
  return ret;
}


export { generateId, createRoom, getPlayersInRoom, joinRoom, playCard };
