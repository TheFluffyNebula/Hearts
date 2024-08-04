import express from "express";
import http from "http";
import { Server } from "socket.io";
import roomRoutes from "./routes/roomRoutes.js";
import roomSockets from "./sockets/roomSockets.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use("/api/rooms", roomRoutes);

roomSockets(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
