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
module.exports = { router };