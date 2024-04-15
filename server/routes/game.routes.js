const express = require("express");
const router = express.Router();
const User = require("../database/models/user.js");
const Game = require("../database/models/game.js");
const Player = require("../database/models/player.js");

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
        const game = await Game.findOne({uuid}).populate("players");
        let tabPlayers = []
        console.log("THI: "+game)
        game.players.forEach(pl=>{
            tabPlayers.push([pl.username,pl.socketid,pl.vote])
        })

        console.log("TAB: "+JSON.stringify(tabPlayers))

        res.status(200).json(JSON.stringify(tabPlayers));


       /* console.log("TABP",game.players);
        game.players.forEach(async (pl) =>{
            console.log("PL: "+pl)
            const doc = await Player.findById(pl).exec();
            console.log("NAME: "+doc)
            tabPlayers.push([doc.username,doc.socketid])
            console.log("TAB2 "+tabPlayers)
        })
        if(tabPlayers.length === game.players.length)
        {
            console.log("TAB: "+tabPlayers)
            
        }*/
        
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
          const newPlayer = new Player(
            {
              socketid:socket,
              user:user._id,
              username:user.username
            }
          )
          await newPlayer.save();
          const newGame = new Game({ uuid: uuid, owner: user._id,name:name,slot:slots,dayTime:dayTime,nightTime:nightTime,players:[newPlayer]});
          if (newGame) {
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