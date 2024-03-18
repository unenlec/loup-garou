const express = require('express')
const app = express()
const port = 4000
const portSocket = 4001
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
<<<<<<< HEAD
=======
const gameRoutes = require("./routes/game.routes.js");
>>>>>>> 4e0eddb17f818bab640d255a88f44c5024648c5e
const connectToMongoDB = require("./database/connectToMongoDB.js");
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);
<<<<<<< HEAD

const Message = require("./database/models/message.js");
=======
const crypto = require("crypto")
const User = require("./database/models/user.js");
const Message = require("./database/models/message.js");
const Game = require("./database/models/game.js");
>>>>>>> 4e0eddb17f818bab640d255a88f44c5024648c5e

const { Server } = require("socket.io");
app.use(cors());
const io = new Server(server,{
    cors:{
        origin:'*'
    }
});
io.on('connection', (socket) => {
<<<<<<< HEAD
  console.log('a user connected');
=======
  console.log('a user connected ID: ',socket.id);
  socket.on("hostingame", async(data)=>{
    console.log("DATA JOIN:",data);
    const uuid = crypto.randomUUID();
    console.log(crypto.randomUUID());
    try{
      const user = await User.findOne({ username:data.user });
      const newGame = new Game({uuid:uuid,owner:user._id});
      await newGame.save();
    }catch(error)
    {
      console.log(error);
    }
    //socket.join(data.gameid)
  })
  socket.on("joinGame", async (data)=>{
    console.log(data);
    
  })
>>>>>>> 4e0eddb17f818bab640d255a88f44c5024648c5e
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
<<<<<<< HEAD
=======
app.use("/api/game", gameRoutes.router);
>>>>>>> 4e0eddb17f818bab640d255a88f44c5024648c5e

app.listen(port, () => {
    connectToMongoDB.connectToMongoDB();
    console.log(`Listening on port ${port}`)
})