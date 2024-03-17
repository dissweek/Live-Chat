const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

app.use(cors({origin: '*'}))

const server = http.createServer(app)

server.listen(5000, () => {
  console.log("Server is running");
});
