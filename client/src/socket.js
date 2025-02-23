import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
// const URL = "http://localhost:3001";



// transports: ['websocket'] // disable xhr poll
// export const socket = io(URL);
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "https://hearts-q4nx.onrender.com";
export const socket = io(SERVER_URL, {
    transports: ["websocket", "polling"],
});
