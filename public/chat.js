$(function() {
  var socket = io.connect("http://localhost:3000");

  var message = $("#message");
  var username = $("#username");
  var send_message = $("#send_message");
  var send_username = $("#send_username");
  var chatroom = $("#chatroom");
  var feedback = $("#feedback");
  var lastSender = "";

  send_username.click(() => {
    sendUsername(username, socket);
    currentUsername = username.val();
  });

  username.keypress(e => {
    if (e.which == 13) {
      sendUsername(username, socket);
      currentUsername = username.val();
    }
  });

  send_message.click(() => {
    sendMessage(username, message, socket);
  });

  message.keypress(e => {
    if (e.which == 13) {
      sendMessage(username, message, socket);
    }
  });

  socket.on("new_message", data => {
    var style = "";
    var cssClass =
      data.username === username.val() ? "messageTo" : "messageFrom";
    if (data.username === "Anonymous") {
      cssClass += " " + "messageAnn";
    }
    chatroom.append(
      `<p class='message ${cssClass}'>
      ${lastSender === data.username ? "" : data.username}: ${
        data.message
      } </p>`
    );
    chatroom.animate({ scrollTop: $(this).height() }, "slow");
    feedback.html("");
    lastSender = data.username;
  });

  message.bind("keypress", e => {
    if (e.which != 13) {
      socket.emit("typing");
    }
  });

  socket.on("typing", data => {
    feedback.html(`<p><i>${data.username} is typing...</i></p>`);
  });
});
