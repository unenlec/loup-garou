const express = require("express");
const app = express();
const port = 4000;
const portSocket = 4002;
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const gameRoutes = require("./routes/game.routes.js");
const connectToMongoDB = require("./database/connectToMongoDB.js");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const User = require("./database/models/user.js");
const Message = require("./database/models/message.js");
const Game = require("./database/models/game.js");
const roleHistory = require("./database/models/roleHistory.js");
const Player = require("./database/models/player.js");

const { Server } = require("socket.io");
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
function addPlayerHistory(player, id, role) {
  const newRoleHistory = new roleHistory({
    game: id,
    player: player,
    role: role,
  });
  newRoleHistory.save();
  Game.updateOne({ _id: id }, { $push: { roles: newRoleHistory } })
    .then((result) => {
      console.log("OK NEWROLEHISTORY");
    })
    .catch((error) => console.log("ERROR PUSH ROLEHISTORY: ", error));
}

//let testObj = {uuid:"98956",nightTime:6,dayTime:4,state:"Jour",round:1,finished:false}
async function jourNuit(gameData) {
  console.log("GAMEDATA: "+gameData)
  let targetDateWait = new Date();
  targetDateWait.setSeconds(targetDateWait.getSeconds() + 2);
  let totalSecondsWait = Math.floor(
    (targetDateWait.getTime() - new Date().getTime()) / 1000
  );

  let targetDateDay = new Date();
  targetDateDay.setSeconds(targetDateDay.getSeconds() + gameData.dayTime);
  let totalSecondsDay = Math.floor(
    (targetDateDay.getTime() - new Date().getTime()) / 1000
  );

  let targetDateNight = new Date();
  targetDateNight.setSeconds(targetDateNight.getSeconds() + gameData.nightTime);
  let totalSecondsNight = Math.floor(
    (targetDateNight.getTime() - new Date().getTime()) / 1000
  );

  let intervalId;
  let game;
  try {
    game = await Game.findOne({ uuid: gameData.uuid });
  } catch (error) {
    console.log(error);
  }

  async function updateCountdown() {
    if (game !== null) {
      if (game?.state === "Nuit" && game.round !== 0) {
        console.log("SECONDS NUIT: " + totalSecondsNight);
        io.to(gameData.uuid).emit("time", {
          timeSeconds: totalSecondsNight,
          round: game.round,
          state: game.state,
        });
        totalSecondsNight--;
        if (totalSecondsNight < 0) {
          console.log("ICI NUIT");
          clearInterval(intervalId);
          console.log("GUUID: " + game.uuid);
          Game.updateOne(
            { uuid: game.uuid },
            { $set: { state: "Jour" }, $inc: { round: 1 } }
          )
            .then((result) => {
              console.log("GAME UPDATED");
              console.log("Cycle jour nuit OK" + game.round);
              jourNuit(game);
            })
            .catch((error) => console.log(error));
        }
      } else {
        if (game.state === "Nuit" && game.round === 0) {
          console.log("ATTENTE ICI: " + totalSecondsWait);
          io.to(gameData.uuid).emit("time", {
            timeSeconds: totalSecondsWait,
            round: game.round,
            state: game.state,
          });
          totalSecondsWait--;
          if (totalSecondsWait < 0) {
            console.log("FIN ATTENTE JOUEUR");
            clearInterval(intervalId);
            //ROLE
            //V,S,P,M,L
            game = await Game.findOne({ uuid: gameData.uuid }).populate("players");
            let playerRandom = game.players.sort(
              (a, b) => 0.5 - Math.random()
            );
            let nbLoup = Math.floor(game.players.length / 4);
            let nbSpe = Math.ceil((game.players.length - nbLoup) / 2);
            let nbVilla = game.players.length - nbLoup - nbSpe;
            let i = 0;
            for (; i < nbLoup; i++) {
              try{
                //let currentPlayer = await Game.findOne({uuid: gameData.uuid}).populate("players");
                addPlayerHistory(playerRandom[i].user, game._id, "Loup");
                console.log("ROLE: "+playerRandom[i].socketid+" LOUP")
                io.to(playerRandom[i].socketid).emit("role", { role: "Loup" });
              }catch(error)
              {
                console.log(error)
              }
              
            }
            for (; i < nbSpe + nbLoup; i++) {
              try{
                //let currentPlayer = await Game.findOne({uuid: gameData.uuid}).populate("players");
                addPlayerHistory(playerRandom[i].user, game._id, "SPE");
                console.log("ROLE: "+playerRandom[i].socketid+" SPE")
                io.to(playerRandom[i].socketid).emit("role", { role: "SPE" });
              }catch(error)
              {
                console.log(error)
              }
            }
            for (; i < nbVilla + nbSpe + nbLoup; i++) {
              try{
                //let currentPlayer = await Game.findOne({uuid: gameData.uuid}).populate("players");
                addPlayerHistory(playerRandom[i].user, game._id, "Villageois");
                console.log("ROLE: "+playerRandom[i].socketid+" Villageois")
                io.to(playerRandom[i].socketid).emit("role", { role: "Villageois" });
              }catch(error)
              {
                console.log(error)
              }
            }

            Game.updateOne(
              { uuid: game.uuid },
              { $set: { state: "Nuit" }, $inc: { round: 1 } }
            )
              .then((result) => {
                console.log("GAME UPDATED");
                console.log("FIN ATTENTE JOUEUR" + game.round);
                jourNuit(game);
              })
              .catch((error) => console.log(error));
          }
        } else {
          console.log("SECONDS: " + totalSecondsDay);
          io.to(gameData.uuid).emit("time", {
            timeSeconds: totalSecondsDay,
            round: game?.round,
            state: game?.state,
          });
          totalSecondsDay--;
          if (totalSecondsDay < 0) {
            console.log("ICI JOUR");
            clearInterval(intervalId);
            console.log("GUUID: " + game.uuid);
            Game.updateOne(
              { uuid: game.uuid },
              { $set: { state: "Nuit" }, $inc: { round: 1 } }
            )
              .then((result) => {
                console.log("GAME UPDATED");
                console.log(game);
                console.log("Cycle jour nuit OK" + game.round);
                jourNuit(game);
              })
              .catch((error) => console.log(error));

            /*Game.updateOne({ uuid: game.uuid },{$inc: {round: 1}}).then((result)=>{
      console.log("GAME UPDATED");
    }).catch(error=>console.log(error));*/
            //console.log(game)
          }
        }
      }
    } else {
      clearInterval(intervalId);
      return;
    }
  }

  intervalId = setInterval(updateCountdown, 1000);
}

/*
Test cycle jour / nuit
jourNuit(testObj)

*/

const userList = new Set();
io.on("connection", (socket) => {
  userList.add(socket.id);
  console.log(
    "a user connected ID: ",
    socket.id,
    "  Number of users ",
    userList.size
  );
  socket.on("hostingame", async (data) => {
    console.log("DATA JOIN:", data);
    socket.emit("gameHosted", data.uuid);
    socket.broadcast.emit("updateGame");
    io.to(data.uuid).emit("updateCurrentGame");
    socket.join(data.uuid);
    /*try {
      console.log("LA SOCKET:",socket.id)
      Game.updateOne({ uuid: data.uuid }, { $push: { players: socket.id } }).then(result => {
        console.log("GAME UPDATED: ", result);
        socket.emit("gameHosted", data.uuid);
        socket.broadcast.emit("updateGame");
        io.to(data.uuid).emit("updateCurrentGame")
        socket.join(data.uuid);
      }).catch(error => console.log("ERROR DOCUMENT: ", error))
    } catch (error) {
      console.log(error);
    }*/
  });
  socket.on("joinGame", async (data) => {
    try {
      const joinedGame = await Game.findOne({ uuid: data.uuid });
      if (joinedGame) {
        console.log("Game found");
        const user = await User.findOne({ username: data.username });
        const newPlayer = new Player({
          socketid: socket.id,
          user: user._id,
          username: user.username,
        });
        await newPlayer.save();
        Game.updateOne({ uuid: data.uuid }, { $push: { players: newPlayer } })
          .then((result) => {
            console.log("GAME UPDATED: ", result);
            socket.broadcast.emit("updateGame");
            socket.emit("joinStatus", { message: "OK", uuid: data.uuid });
            io.to(data.uuid).emit("updateCurrentGame");
            socket.join(data.uuid);
            console.log(
              "GAME SLOT: " +
                joinedGame.slot +
                " PLAYER COUNT: " +
                joinedGame.players.length +
                1
            );
            if (joinedGame.slot === joinedGame.players.length + 1) {
              console.log("GAME FULL");
              jourNuit(joinedGame);
              //socket.to(joinedGame.uuid).emit("startGame");
            }
          })
          .catch((error) => console.log("ERROR DOCUMENT: ", error));
      }
      socket.emit("joinStatus", "NO");
    } catch (error) {
      console.error("Error :", error);
    }
    let user = { user: socket.id, gameId: data };
    userList.add(user);
  });
  socket.on("startGame", async (data) => {
    console.log("GAME UUID: " + data.uuid + " IS STARTING");
  });

  socket.on("vote", async (data)=>{
    try{
      const game = await Game.findOne({ uuid: data.uuid }).populate("players");
      const player = game.players.find(pl=>pl.username === data.username)
      player.vote++;
      await game.save();
      io.emit("onVote",{user:data.who,vote:1})

    }catch(error)
    {
      console.log(error)
    }

  })
  socket.on("message", async (data) => {
    try {
      const newMessage = new Message({
        username: data.username,
        textemsg: data.message.message,
      });
      await newMessage.save();
    } catch (error) {
      console.error("Error saving message:", error);
    }
    data.message.sid = socket.id;
    console.log("LOG: ON MESSAGE: ", JSON.stringify(data));
    socket.to(data.uuid).emit("receive", data);
  });

  socket.on("disconnect", async () => {
    userList.delete(socket.id);
    console.log("DISCONNECTED"+userList.size)
    try {
      const user = await Player.findOne({ socketid: socket.id });
      if (user) {
        Game.updateMany(
          { players: { $in: [user._id] }, finished: false },
          { $pull: { players: user._id } }
        )
          .then((result) => {
            console.log("GAME UPDATED");
            io.emit("updateGame");
          })
          .catch((error) => console.log("DISCONNECT", error));
        Game.deleteMany({ players: { $size: 0 } })
          .then((result) => console.log(result))
          .catch((error) => console.log(error));
        console.log(
          "a user disconnected ID: ",
          socket.id,
          "  Number of users ",
          userList.size
        );
      }
    } catch (error) {
      console.log(error);
    }
  });
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
  console.log(`Listening on port ${port}`);
});
