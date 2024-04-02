const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.ObjectId,
        required: true,
    },
    players: {
        type: [String],
    },
    slot: {
        type: Number,
        default: 4
    },
    dayTime:{
        type:Number,
        default: 120
    },
    nightTime:{
        type:Number,
        default: 120
    },
    round:{
        type:Number,
        default: 1
    },
    state:{
        type:String
    },
    finished:{
        type:Boolean,
        default: false
    }
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;