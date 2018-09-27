$(function() {
  var socket = io.connect("https://super-chat-app-lod.herokuapp.com/");

  var message = $("#message");
  var username = $("#username");
  var send_message = $("#send_message");
  var send_username = $("#send_username");
  var chatroom = $("#chatroom");
  var feedback = $("#feedback");

  send_username.click(() => {
    if (username.val() === "") {
      alert("You have to enter username!");
      return;
    }
    console.log(username.val());
    socket.emit("change_username", { username: username.val() });
    $("#change_username").fadeOut();
  });

  socket.on("new_message", data => {
    console.log(data);
    var style = "";
    var cssClass =
      data.username === username.val() ? "messageTo" : "messageFrom";
    if (data.username === "Anonymous") style = "background-color: #f12222";
    console.log(cssClass);
    chatroom.append(
      `<p class='message ${cssClass}' style='${style}'> ${data.username}: ${
        data.message
      } </p>`
    );
    feedback.html("");
  });

  send_message.click(() => {
    socket.emit("new_message", {
      message: message.val(),
      username: username.val()
    });
    message.val("");
  });

  message.bind("keypress", () => {
    socket.emit("typing");
  });

  socket.on("typing", data => {
    feedback.html(`<p><i>${data.username} is typing...</i></p>`);
  });
});
