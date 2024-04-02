const express = require('express')
const app = express()
const port = 4000
const portSocket = 4002
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
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

let testObj = {uuid:"98956",nightTime:6,dayTime:4,state:"Jour",round:1,finished:false}
function jourNuit(gameData)
{
let targetDateDay = new Date();
targetDateDay.setSeconds(targetDateDay.getSeconds() + gameData.dayTime);                                                           
let totalSecondsDay = Math.floor((targetDateDay.getTime() - new Date().getTime()) / 1000);
let targetDateNight = new Date();
targetDateNight.setSeconds(targetDateNight.getSeconds() + gameData.nightTime);                                                           
let totalSecondsNight = Math.floor((targetDateNight.getTime() - new Date().getTime()) / 1000);
let intervalId;
function updateCountdown() {
  if(gameData.state === "Nuit"){
    console.log(totalSecondsNight);
    totalSecondsNight--;
    if (totalSecondsNight < 0 && testObj.finished===false) {
  
      clearInterval(intervalId);
      gameData.state = "Jour";
      console.log("Cycle jour nuit OK"+testObj.round)
      testObj.round++;
      jourNuit(gameData)
    }
  }else{
  console.log(totalSecondsDay);
  io.to(gameData.uuid).emit("time",{totalSecondsDay,round:gameData.round,state:gameData.state});
  totalSecondsDay--;
  if (totalSecondsDay < 0 && testObj.finished===false) {

    clearInterval(intervalId);
    console.log("Cycle jour nuit OK"+testObj.round)
    gameData.state = "Nuit";
    testObj.round++;
    jourNuit(testObj)
  }
  }
}

intervalId= setInterval(updateCountdown,1000);
}

/*
Test cycle jour / nuit
jourNuit(testObj)

*/

const userList = new Set();
io.on('connection', (socket) => {
  userList.add(socket.id);
  console.log('a user connected ID: ', socket.id, "  Number of users ", userList.size);
  socket.on("hostingame", async (data) => {
    console.log("DATA JOIN:", data);
    /*const uuid = crypto.randomUUID();
    console.log(crypto.randomUUID());*/
    try {
      /*const user = await User.findOne({ username: data.user });
      const newGame = new Game({ uuid: uuid, owner: user._id,players:[socket.id] });
      if (newGame) {
        socket.emit("gameHosted", uuid);
        socket.broadcast.emit("updateGame");
        socket.join(uuid);
      }
      await newGame.save();*/
      Game.updateOne({ uuid: data.uuid }, { $push: { players: socket.id } }).then(result => {
        console.log("GAME UPDATED: ", result);
        socket.emit("gameHosted", data.uuid);
        socket.broadcast.emit("updateGame");
        socket.join(data.uuid);
      }).catch(error => console.log("ERROR DOCUMENT: ", error))
    } catch (error) {
      console.log(error);
    }
  })
  socket.on("joinGame", async (data) => {
    try {
      const joinedGame = await Game.findOne({ uuid: data });
      if (joinedGame) {
        console.log("Game found");

        Game.updateOne({ uuid: data }, { $push: { players: socket.id } }).then(result => {
          console.log("GAME UPDATED: ", result);
          socket.broadcast.emit("updateGame");
          socket.emit("joinStatus", { message: "OK", uuid: data });
          socket.join(data);
          console.log("GAME SLOT: " + joinedGame.slot + " PLAYER COUNT: " + joinedGame.players.length)
          if (joinedGame.slot === joinedGame.players.length) {
            console.log("GAME FULL");
            jourNuit(joinedGame)
            //socket.to(joinedGame.uuid).emit("startGame");
          }
        }).catch(error => console.log("ERROR DOCUMENT: ", error))

      }
      socket.emit("joinStatus", "NO");

    } catch (error) {
      console.error('Error :', error);
    }
    let user = { user: socket.id, gameId: data };
    userList.add(user);
  })
  socket.on("startGame", async (data)=>{
    console.log("GAME UUID: "+data.uuid+" IS STARTING")
    

  })

  socket.on("message", async (data) => {
    try {
      const newMessage = new Message({ username: data.username, textemsg: data.message.message });
      await newMessage.save();
    } catch (error) {
      console.error('Error saving message:', error);
    }
    data.message.sid = socket.id;
    console.log("LOG: ON MESSAGE: ", JSON.stringify(data));
    socket.to(data.uuid).emit("receive", data);
  })

  socket.on("disconnect", async () => {
    userList.delete(socket.id);
      Game.updateMany({ players: {$in: [socket.id] }, finished: false },{$pull: {players: socket.id}}).then((result)=>{
        console.log("GAME UPDATED");
        io.emit("updateGame");
      }).catch(error=>console.log(error));
      Game.deleteMany({players: {$size: 0}}).then(result=>console.log(result)).catch(error=>console.log(error));
    console.log('a user disconnected ID: ', socket.id, "  Number of users ", userList.size);
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