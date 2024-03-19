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
    finished:{
        type:Boolean,
        default: false
    }
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;