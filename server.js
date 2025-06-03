const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    socket.to(room).emit('message', {
      user: 'Sistema',
      text: 'Alguém entrou no chat!',
      time: new Date()
    });
  });

  socket.on('sendMessage', ({ room, message }) => {
    io.to(room).emit('message', {
      user: 'Usuário',
      text: message,
      time: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(3000, () => {
  console.log('✅ Servidor rodando em http://localhost:3000');
});
