const express = require('express')
const app = express()
const port = 4000
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const connectToMongoDB = require("./database/connectToMongoDB.js");
dotenv.config();
app.use(express.json());

app.use("/api/auth", authRoutes.router);

app.listen(port, () => {
    connectToMongoDB.connectToMongoDB();
    console.log(`Listening on port ${port}`)
})