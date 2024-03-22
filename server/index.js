const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./route");
const app = express();
const {addUser,findUser,getRoomUsers} = require('./users')

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
    const { user, isExist } = addUser({name,room})

    const userMessage = isExist
    ? `${user.name}, here you go again`
    : `Hi,${user.name}. Welcome to our chat.`
    

    socket.emit('message',{
      data:{
        user: {name:'admin',role:'admin'},
        message:  userMessage,
      }
    })
    socket.broadcast.to(user.room).emit('message',{
      data:{
        user: {name:'admin',role:'admin'},
        message:  `${user.name} Has joined`,
      }
    })

    io.to(user.room).emit('room',{data: {users:getRoomUsers(user.room)} })
  })

  socket.on('sendMessage',({message,params})=>{
    const user = findUser(params)
    if(user){         
      io.to(user.room).emit('message',{ data:{user,message}})
    }
  })

  socket.on('leftRoom',({params})=>{
    const user = findUser(params)

    if(user){         
      io.to(user.room).emit('message',)
    }
  })


  socket.on("disconnect", () => {
    console.log(socket.rooms);
  });
});

server.listen(5000, () => {
  console.log("Server is running");
});
