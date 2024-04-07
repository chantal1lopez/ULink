const express = require("express")
const { createServer } = require("http");
const cors = require("cors")
const http = require('http');
const socketIo = require('socket.io');
const { Server } = require('socket.io');



require("dotenv").config();
const { dbConnect } = require("./config/mongo");
const { verifyToken } = require("./utils/handleJwt");

const app = express()
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5000',
    methods: ["GET", "POST"],
  },
});

global.io = io;


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('authenticate', async ({ token }) => { 
    try {
      const decoded = await verifyToken(token); 
      const userId = decoded._id.toString();

      socket.join(userId);

      console.log(`Socket ${socket.id} asociado con userId ${userId}`);
    } catch (error) {
      console.log('Autenticación fallida', error);
      socket.disconnect(); 
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});


app.use(cors())
app.use(express.json())

app.use(express.static("storage"))

app.use("/api", require("./routes/index"))

const port = process.env.PORT || 3002

server.listen(port, () => {
  console.log("Servidor escuchando en el puerto " + port)
  dbConnect();


})

module.exports = { server }