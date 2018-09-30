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

function sendMessage(message, socket) {
  var text = message.val().trim();
  if (text === "") {
    alert("You can't send an empty message!");
    return;
  }
  socket.emit("new_message", {
    message: text
  });
  message.val("");
}

function generateListDiv(data) {
  return `<p class="user" style="color:${data.color}">${data.username}</p>`;
}

function myScroll(chatroom) {
  chatroom.animate({ scrollTop: $("#chatroom").prop("scrollHeight") }, "fast");
}
