const express = require("express");
const router = express.Router();
const User = require("../database/models/user.js");
const Game = require("../database/models/game.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");


router.get("/getGameList", async (req,res)=>{
    try{
        const game = await Game.find({finished:false});
        res.status(200).json(JSON.stringify(game));
    }catch(error)
    {
        console.log(error);
    }
})

router.post("/getPlayers", async (req,res)=>{
    try{
        const {uuid} = req.body;
        const game = await Game.findOne({uuid});
        res.status(200).json(JSON.stringify(game.players));
    }catch(error)
    {
        console.log(error);
    }
})

router.post("/createGame", async (req,res)=>{
    try{
        const {username,name,slots,dayTime,nightTime,socket} = req.body;
        const uuid = crypto.randomUUID();
        console.log(crypto.randomUUID());
          const user = await User.findOne({ username: username });
          const newGame = new Game({ uuid: uuid, owner: user._id,name:name,slot:slots,dayTime:dayTime,nightTime:nightTime,players:[socket]});
          if (newGame) {
            /*socket.emit("gameHosted", uuid);
            socket.broadcast.emit("updateGame");
            socket.join(uuid);*/
            res.status(200).json({status:"gameOK",uuid:uuid});
          }
          await newGame.save();
        
    }catch(error)
    {
        console.log(error);
    }
})

router.post("/getGameData", async (req,res)=>{
    try{
        const {uuid} = req.body;
        const game = await Game.findOne({uuid});
        res.status(200).json(JSON.stringify(game));
    }catch(error)
    {
        console.log(error);
    }
})
module.exports = { router };