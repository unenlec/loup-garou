const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    name:{
        type:String,
        default: "Partie"
    },
    owner: {
        type: mongoose.ObjectId,
        required: true,
    },
    players:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player"
    }],
    roles:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "roleHistory"
    }],
    slot: {
        type: Number,
        default: 4
    },
    dayTime:{
        type:Number,
        default: 10
    },
    nightTime:{
        type:Number,
        default: 10
    },
    round:{
        type:Number,
        default: 0
    },
    state:{
        type:String,
        default: "Nuit"
    },
    finished:{
        type:Boolean,
        default: false
    }
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;