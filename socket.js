const { Server } = require('socket.io');

const io = new Server(9000, {
  cors: true,
});

const userToSocketId = new Map();
const socketIdToUser = new Map();

io.on('connection', (socket) => {
  /*
    Socket events
  */

  socket.on('room:join', (data) => {
    const { userId: user, room } = data;
    userToSocketId.set(user, socket.id);
    socketIdToUser.set(socket.id, user);

    // Emit event to give incoming user details
    io.to(room).emit('user:joined', { user, id: socket.id });

    // Pushing user to room
    socket.join(room);
    io.to(socket.id).emit('room:join', data);
  });

  socket.on('user:call', function ({to, offer}) {
    console.log("Remote offer:", offer);
    io.to(to).emit("call:incoming", {from: socket.id, offer})
  });

  socket.on("call:accepted", ({to, answer}) => {
    io.to(to).emit("call:accepted", {from: socket.id, answer})
  })

  socket.on('peer:nego:needed', ({offer, to}) => {
    io.to(to).emit("peer:nego:needed", {from: socket.id, offer})
  })

  socket.on('peer:nego:done', ({to, ans}) => {
    io.to(to).emit("peer:nego:final", {from: socket.id, ans})
  })
});
