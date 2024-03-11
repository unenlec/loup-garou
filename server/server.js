const express = require('express')
const app = express()
const port = 4000
const portSocket = 4001
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const connectToMongoDB = require("./database/connectToMongoDB.js");
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);

const Message = require("./database/models/message.js");

const { Server } = require("socket.io");
app.use(cors());
const io = new Server(server,{
    cors:{
        origin:'*'
    }
});
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("message", async (data)=>{
    try {   
      const newMessage = new Message({ username: data.username, textemsg: data.message.message });
      await newMessage.save();
    } catch (error) {
        console.error('Error saving message:', error);
    }
    socket.broadcast.emit("receive",data)
  })
});

server.listen(portSocket, () => {
  console.log(`Listening on port ${portSocket}`);
});




dotenv.config();
app.use(express.json());

app.use("/api/auth", authRoutes.router);

app.listen(port, () => {
    connectToMongoDB.connectToMongoDB();
    console.log(`Listening on port ${port}`)
})