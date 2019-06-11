const express = require("express");
const tools = require("./server/functions");
const moment = require("moment");
const port = 80;

const app = express(),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server);

//set the template engine ejs
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("pages/index");
});

server.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

server.on("exit", () => {
  console.log("App is off!");
});

let userCount = 0;
const maxUsers = 15;
const colors = tools.getColors(maxUsers);

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

    socket.broadcast.emit("new_user", {
      id: socket.id,
      color: socket.color,
      username: socket.username
    });

    socket.emit("connected", {
      id: socket.id,
      color: socket.color,
      username: socket.username
    });

    socket.on("change_username", data => {
      const old = socket.username;
      socket.username = data.username;
      socket.emit("change_username", { username: socket.username });

      console.log(`${old} changed username to ${data.username}`);

      io.sockets.emit(
        "refresh_list",
        tools.generateUsers(io.sockets.clients())
      );
    });

    socket.on("new_message", (data, callback) => {
      io.sockets.emit("new_message", {
        message: tools.urlify(data.message),
        username: socket.username,
        color: socket.color,
        id: socket.id
      });
      // callback({ ok: true, message: "Your message has been sent!" });
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
        id: socket.id
      });
      console.log(`User left - Active users: ${userCount}`);
    });
  }
});
