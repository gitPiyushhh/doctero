const { Server } = require('socket.io');

const io = new Server(9000, {
    cors: true
});

io.on('connection', (socket) => {
    console.log("Socket connected on: ", socket.id);
});
