const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({

    user: {
        type: mongoose.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    socketid:{
        type: String,
        required: true
    },
    vote:{
        type:Number,
        default:0
    },
    win:
    {
        type:Boolean,
        default:false
    }
});

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;