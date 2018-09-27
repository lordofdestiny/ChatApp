function sendUsername(username, socket) {
  if (username.val() === "") {
    alert("You have to enter username!");
    return;
  }
  socket.emit("change_username", { username: username.val() });
  $("#change_username").hide();
  $("#section_username").append(
    `<p class="loggedin">You are logged in as: <b>${username.val()}</b></p>`
  );
}

function sendMessage(username, message, socket) {
  var text = message.val().trim();
  if (text === "") return;
  socket.emit("new_message", {
    message: text,
    username: username.val()
  });
  message.val("");
}
