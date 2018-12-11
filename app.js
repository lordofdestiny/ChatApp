const express = require("express");
const tools = require("./server/functions");
const moment = require("moment");

const app = express(),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server);

//set the template engine e js
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("pages/index");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000!");
});

var number = 0;
var maxUsers = 15;
var colors = tools.getColors(15);

io.on("connection", async socket => {
  if (number >= maxUsers) {
    socket.emit("declined");
    socket.disconnect(true);
  } else {
    number++;
    console.log(`User connected, current users ${number}`);
    socket.username = "Anonymous";
    socket.index = tools.findFree(colors, maxUsers);
    colors[socket.index].used = true;
    socket.color = colors[socket.index].color;

    io.sockets.emit("refreshList", tools.generateUsers(io.sockets.clients()));
    socket.emit("connected", {
      id: socket.id,
      color: socket.color,
      username: socket.username
    });

    socket.on("change_username", data => {
      socket.username = data.username;
      socket.emit("change_username", { username: socket.username });
      //console.log(`Username changed to ${data.username}`);
      io.sockets.emit("refreshList", tools.generateUsers(io.sockets.clients()));
    });

    socket.on("new_message", data => {
      io.sockets.emit("new_message", {
        message: tools.urlify(data.message),
        username: socket.username,
        color: socket.color,
        id: socket.id,
        time: data.time
      });
    });

    socket.on("typing", data => {
      socket.broadcast.emit("typing", {
        id: socket.id,
        username: socket.username,
        color: socket.color
      });
    });

    socket.on("refreshList", () => {
      let all = tools.generateUsers(io.sockets.clients());
      io.sockets.emit("refreshList", tools.generateUsers(io.sockets.clients()));
    });

    socket.on("disconnect", async () => {
      number--;
      let all = await tools.generateUsers(io.sockets.clients());
      io.sockets.emit("refreshList", all);
      colors[socket.index].used = false;
      socket.broadcast.emit("user_left", {
        username: socket.username,
        color: socket.color,
        id: socket.id,
        time: moment().format("HH : mm")
      });
      console.log(`User has left, current users: ${number}`);
    });
  }
});
