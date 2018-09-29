const express = require("express");
const app = express();
const tools = require("./functions");
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

io.on("connection", socket => {
  if (number >= maxUsers) {
    socket.emit("declined");
    socket.disconnect(true);
  } else {
    socket.username = "Anonymous";

    number++;
    console.log(`User connected, current users ${number}`);
    socket.color = tools.rainbow(maxUsers, number);

    socket.on("change_username", data => {
      socket.username = data.username;
      console.log(`Username changed to ${data.username}`);
    });

    socket.on("new_message", data => {
      io.sockets.emit("new_message", {
        message: data.message,
        username: socket.username,
        url: data.url,
        color: socket.color
      });
    });

    socket.on("typing", data => {
      socket.broadcast.emit("typing", { username: socket.username });
    });

    socket.on("disconnect", () => {
      number--;
      socket.broadcast.emit("user_left", {
        username: socket.username,
        color: socket.color
      });
      console.log(`User has left, current users: ${number}`);
    });
  }
});
