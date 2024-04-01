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

let targetDate = new Date();
targetDate.setSeconds(targetDate.getSeconds() + 10);
//targetDate.setMinutes(targetDate.getMinutes() + 10);                                                                
//targetDate.setHours(targetDate.getHours() +2);                                                             
let totalSeconds = Math.floor((targetDate.getTime() - new Date().getTime()) / 1000);
let intervalId;
function updateCountdown() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  console.log(totalSeconds);
  totalSeconds--;
  if (totalSeconds < 0) {

    clearInterval(intervalId);

    console.log("Cycle jour nuit OK")
  }
}
intervalId = setInterval(updateCountdown, 1000);
const userList = new Set();
io.on('connection', (socket) => {
  userList.add(socket.id);
  console.log('a user connected ID: ', socket.id, "  Number of users ", userList.size);
  socket.on("hostingame", async (data) => {
    console.log("DATA JOIN:", data);
    const uuid = crypto.randomUUID();
    console.log(crypto.randomUUID());
    try {
      const user = await User.findOne({ username: data.user });
      const newGame = new Game({ uuid: uuid, owner: user._id });
      if (newGame) {
        socket.emit("gameHosted", uuid);
        socket.broadcast.emit("updateGame");
        socket.join(uuid);
      }
      await newGame.save();
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

  socket.on("disconnect", () => {
    userList.delete(socket.id);
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