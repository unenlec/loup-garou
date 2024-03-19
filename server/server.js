const express = require('express')
const app = express()
const port = 4000
const portSocket = 4001
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const gameRoutes = require("./routes/game.routes.js");
const connectToMongoDB = require("./database/connectToMongoDB.js");
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const crypto = require("crypto")
const User = require("./database/models/user.js");
const Message = require("./database/models/message.js");
const Game = require("./database/models/game.js");

const { Server } = require("socket.io");
app.use(cors());
const io = new Server(server,{
    cors:{
        origin:'*'
    }
});


const userList = new Set();
io.on('connection', (socket) => {
  console.log('a user connected ID: ',socket.id,"  Number of users ",userList.size);
  userList.add(socket.id);
  socket.on("hostingame", async(data)=>{
    console.log("DATA JOIN:",data);
    const uuid = crypto.randomUUID();
    console.log(crypto.randomUUID());
    try{
      const user = await User.findOne({ username:data.user });
      const newGame = new Game({uuid:uuid,owner:user._id});
      if(newGame)
      {
        socket.emit("gameHosted",uuid);
        socket.broadcast.emit("updateGame");
      }
      await newGame.save();
    }catch(error)
    {
      console.log(error);
    }
    //socket.join(data.gameid)
  })
  socket.on("joinGame", async (data)=>{
    try{
      const joinedGame = await Game.findOne({ uuid:data });
      if(joinedGame)
      {
        console.log("Game found");
        socket.emit("joinStatus",{message:"OK",uuid:data});
        Game.updateOne({uuid:data},{$push: {players:socket.id}}).then(result => {
          console.log("GAME UPDATED: ",result);
          socket.broadcast.emit("updateGame");
        }).catch(error => console.log("ERROR DOCUMENT: ",error))

      }
      socket.emit("joinStatus","NO");

    }catch(error)
    {
      console.error('Error :', error);
    }
    let user = {user:socket.id,gameId:data};
    userList.add(user);
  })
  socket.on("message", async (data)=>{
    try {   
      const newMessage = new Message({ username: data.username, textemsg: data.message.message });
      await newMessage.save();
    } catch (error) {
        console.error('Error saving message:', error);
    }
    data.message.sid=socket.id;
    console.log(data);
    socket.to(data.uuid).emit("receive",data);
  })

  socket.on("disconnect", ()=>{
    console.log('a user disconnected ID: ',socket.id,"  Number of users ",userList.size);
    userList.delete(socket.id);
  })
});

server.listen(portSocket, () => {
  console.log(`Listening on port ${portSocket}`);
});


dotenv.config();
app.use(express.json());

app.use("/api/auth", authRoutes.router);
app.use("/api/game", gameRoutes.router);

app.listen(port, () => {
    connectToMongoDB.connectToMongoDB();
    console.log(`Listening on port ${port}`)
})