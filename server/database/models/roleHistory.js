const mongoose = require('mongoose');

const roleHistorySchema = new mongoose.Schema({

    game: {
        type: mongoose.ObjectId,
        required: true
    },
    player:{
        type: mongoose.ObjectId,
        required: true
    },
    username:{
        type:String,
        required:true
    },
    socketid:{
        type:String,
        required:true
    },
    role: {
        type: String,
        default: "Villageois",
        required: true,
    }
});

const roleHistory = mongoose.model("roleHistory", roleHistorySchema);
module.exports = roleHistory;