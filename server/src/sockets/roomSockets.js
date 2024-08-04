export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('join', (roomId) => {
      socket.join(roomId);
    });
  });
}
