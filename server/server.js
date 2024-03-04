const express = require('express')
const app = express()
const port = 4000
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const connectToMongoDB = require("./database/connectToMongoDB.js");
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
app.use(cors());
/*const io = new Server(server,{
    cors:{
        origin:'*'
    }
});
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("message",(data)=>{
    console.log(data)
    socket.broadcast.emit("receive",data)
  })
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});*/




dotenv.config();
app.use(express.json());

app.use("/api/auth", authRoutes.router);

app.listen(port, () => {
    connectToMongoDB.connectToMongoDB();
    console.log(`Listening on port ${port}`)
})