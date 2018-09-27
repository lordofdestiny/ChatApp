const express = require("express");
const app = express();

var port = process.env.PORT;

//set the template engine ejs
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("index");
});

server = app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

const io = require("socket.io")(server);

io.on("connection", socket => {
  console.log("New user connected");

  socket.username = "Anonymous";

  socket.on("change_username", data => {
    socket.username = data.username;
    console.log(`Username changed to ${data.username}`);
  });

  socket.on("new_message", data => {
    io.sockets.emit("new_message", {
      message: data.message,
      username: socket.username
    });
    console.log("Message received");
  });

  socket.on("typing", data => {
    socket.broadcast.emit("typing", { username: socket.username });
  });
});
