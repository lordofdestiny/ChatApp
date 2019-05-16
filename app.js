const express = require("express");
const tools = require("./server/functions");
const moment = require("moment");
const appName = "Chat app";

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
  console.log("Listening on port 3000!");
});

server.on("exit", () => {
  console.log("App is off!");
});

let userCount = 0;
const maxUsers = 15;
const colors = tools.getColors(15);

io.on("connection", async socket => {
  if (userCount >= maxUsers) {
    socket.emit("declined");
    socket.disconnect(true);
  } else {
    userCount++;
    console.log(`New User - Connected users: ${userCount}`);
    socket.username = "Anonymous";
    socket.index = tools.findFree(colors, maxUsers);
    colors[socket.index].used = true;
    socket.color = colors[socket.index].color;

    io.sockets.emit("refresh_list", tools.generateUsers(io.sockets.clients()));

    socket.emit("connected", {
      id: socket.id,
      color: socket.color,
      username: socket.username
    });

    socket.on("change_username", data => {
      const old = socket.usernamel;
      socket.username = data.username;
      socket.emit("change_username", { username: socket.username });

      console.log(`${old} changed username to ${data.username}`);

      io.sockets.emit(
        "refresh_list",
        tools.generateUsers(io.sockets.clients())
      );
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
        username: socket.username,
        color: socket.color
      });
    });

    socket.on("stop_typing", data => {
      socket.broadcast.emit("stop_typing", data);
    });

    socket.on("refresh_list", () => {
      const all = tools.generateUsers(io.sockets.clients());
      io.sockets.emit("refresh_list", all);
    });

    socket.on("disconnect", async () => {
      userCount--;
      const all = await tools.generateUsers(io.sockets.clients());
      io.sockets.emit("refresh_list", all);
      colors[socket.index].used = false;
      socket.broadcast.emit("user_left", {
        username: socket.username,
        color: socket.color,
        id: socket.id,
        time: moment().format("HH : mm")
      });
      console.log(`User left - Active users: ${userCount}`);
    });
  }
});
