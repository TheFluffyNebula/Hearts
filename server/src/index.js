import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import roomRoutes from './routes/roomRoutes.js';
import roomSockets from './sockets/roomSockets.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIO(server);

// Use routes
app.use('/api/rooms', roomRoutes);

// Setup Socket.IO
roomSockets(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
