const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./route");
const app = express();
const {addUser} = require('./users')

app.use(cors({origin: '*'}))
app.use(route)

const server = http.createServer(app)
const io = new Server(server,{
  cors:{
    origin:'*',
    methods:['GET','POST'],
  },
})

io.on("connection", socket => {

  socket.on('join',({name,room})=>{
    socket.join(room)
    const { user } = addUser({name,room})

    socket.emit('message',{
      data:{
        user: {name:'admin',role:'admin'},
        message:  `Hi,${user.name}. Welcome to our chat.`,
      }
    })
    socket.broadcast.to(user.room).emit('message',{
      data:{
        user: {name:'admin',role:'admin'},
        message:  `${user.name} Has joined`,
      }
    })
  })


  socket.on("disconnect", () => {
    console.log(socket.rooms);
  });
});

server.listen(5000, () => {
  console.log("Server is running");
});
