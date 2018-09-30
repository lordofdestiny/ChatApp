const express = require("express");
const app = express();
const tools = require("./server/functions");
const uuid = require("uuid/v1");
var number = 0;
var maxUsers = 15;

//set the template engine e js
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("pages/index");
});

server = app.listen(3000, () => {
  console.log("Server listening on port 3000!");
});

const io = require("socket.io")(server);
var colors = tools.getColors(15);

io.on("connection", async socket => {
  if (number >= maxUsers) {
    socket.emit("declined");
    socket.disconnect(true);
  } else {
    number++;
    console.log(`User connected, current users ${number}`);
    socket.id = uuid();
    socket.username = "Anonymous";
    socket.index = tools.findFree(colors, maxUsers);
    colors[socket.index].used = true;
    socket.color = colors[socket.index].color;

    let all = tools.generateUsers(io.sockets.clients());
    io.sockets.emit("refreshList", all);
    socket.emit("connected", {
      id: socket.id,
      color: socket.color,
      username: socket.username
    });

    socket.on("change_username", data => {
      socket.username = data.username;
      socket.emit("change_username", { username: socket.username });
      console.log(`Username changed to ${data.username}`);
    });

    socket.on("new_message", data => {
      io.sockets.emit("new_message", {
        message: tools.urlify(data.message),
        username: socket.username,
        color: socket.color,
        id: socket.id
      });
    });

    socket.on("typing", data => {
      socket.broadcast.emit("typing", {
        id: socket.id,
        username: socket.username
      });
    });

    socket.on("refreshList", data => {
      let all = tools.generateUsers(io.sockets.clients());
      socket.emit("refreshList", all);
    });

    socket.on("disconnect", async () => {
      number--;
      let all = await tools.generateUsers(io.sockets.clients());
      io.sockets.emit("refreshList", all);
      colors[socket.index].used = false;
      socket.broadcast.emit("user_left", {
        username: socket.username,
        color: socket.color,
        id: socket.id
      });
      console.log(`User has left, current users: ${number}`);
    });
  }
});
