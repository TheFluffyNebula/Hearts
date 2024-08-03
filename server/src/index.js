import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import roomRoutes from './routes/roomRoutes.js';
import { setupSocket } from './sockets/roomSockets.js';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.io = io;
    next();
  });
  

// Setup HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server);

// Setup socket events
setupSocket(io);

// Setup routes
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
