const mongoose = require("mongoose");

const connectToMongoDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO);
        console.log("DB OK");

    } catch (error) {
        console.log("ERROR: " + error.message);

    }
}

module.exports = { connectToMongoDB };