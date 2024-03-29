const { Server } = require('socket.io');

const io = new Server(9000, {
  cors: true,
});

const userToSocketId = new Map();
const socketIdToUser = new Map();

/*
  Event handlers
*/
function handleRoomJoin(io, socket, userToSocketId, socketIdToUser, data) {
  const { userId: user, room } = data;
  userToSocketId.set(user, socket.id);
  socketIdToUser.set(socket.id, user);

  io.to(room).emit('user:joined', { user, id: socket.id });

  socket.join(room);
  io.to(socket.id).emit('room:join', data);
}

function handleUserCall(io, socket, to, offer) {
  console.log('Remote offer:', offer);
  io.to(to).emit('call:incoming', { from: socket.id, offer});
}

function handleCallAccepted(io, socket, to, answer) {
  io.to(to).emit('call:accepted', { from: socket.id, answer });
}

function handleNegoNeeded(io, socket, to, offer) {
  io.to(to).emit('peer:nego:needed', { from: socket.id, offer });
}

function handleNegoDone(io, socket, to, ans) {
  io.to(to).emit('peer:nego:final', { from: socket.id, ans });
}

function handleChatMessage(io, socket, to, message) {
  io.to(to).emit('chat:message', { message });
}

const handleCallEnd = (io, socket, to) => {
  peerService.closePeerConnection(to);
  io.to(to).emit('call:ended');
};

/*
  Socket signals
*/
io.on('connection', (socket) => {
  socket.on('room:join', (data) => {
    handleRoomJoin(io, socket, userToSocketId, socketIdToUser, data);
  });

  socket.on('user:call', ({ to, offer }) => {
    handleUserCall(io, socket, to, offer);
  });

  socket.on('call:accepted', ({ to, answer }) => {
    handleCallAccepted(io, socket, to, answer);
  });

  socket.on('peer:nego:needed', ({ offer, to }) => {
    handleNegoNeeded(io, socket, to, offer);
  });

  socket.on('peer:nego:done', ({ to, ans }) => {
    handleNegoDone(io, socket, to, ans);
  });

  socket.on('chat:message', ({ to, message }) => {
    handleChatMessage(io, socket, to, message);
  });

  socket.on("call:ended", ({to}) => {
    handleCallEnd(io, socket, to);
  })
});
