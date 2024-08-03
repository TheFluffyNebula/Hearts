const roomSockets = (io) => {
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  };
  
  export default roomSockets;
  