$(function() {
  var socket = io.connect("http://localhost:3000");

  var message = $("#message");
  var username = $("#username");
  var send_message = $("#send_message");
  var send_username = $("#send_username");
  var chatroom = $("#chatroom");
  var feedback = $("#feedback");
  var refresh = $(".refresh");
  var users = $("#users");

  // for (let i = 0; i < 15; i++) {
  //   let lmao = " reg";
  //   if (i % 3 === 0) lmao = " self";
  //   chatroom.append(
  //     `<p class="message${lmao}">faihfdila hfla f hkhfg alkjfl afg ja;jf akljfh kajf ikah iah ahg ha hafhak  asdj asd</p>`
  //   );
  // }

  refresh.click(() => {
    socket.emit("refreshList", "lmao");
    refresh.rotate();
  });

  socket.on("refreshList", data => {
    users.empty();
    let size = data.length;
    $("#count").replaceWith(`<span id="count">${size}</span>`);
    for (let user of data) {
      users.append(generateListDiv(user));
    }
  });

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
    sendMessage(message, socket);
  });

  message.keypress(e => {
    if (e.which == 13) {
      sendMessage(message, socket);
    }
  });

  socket.on("connected", data => {
    socket.id = data.id;
    socket.username = data.username;
    socket.color = data.color;
  });

  socket.on("change_username", data => {
    socket.username = data.username;
  });

  socket.on("declined", () => {
    alert("You can't connct now, channel is ful!");
    $("body")
      .children()
      .hide();
    $("body").append(
      `<h1 style="text-align: center">Please try again later, some user may leave chat!</h1`
    );
  });

  socket.on("new_message", data => {
    let self = " reg";
    let self2 = "";
    if (data.id === socket.id) {
      self = " self";
      self2 = " self2";
    }
    chatroom.append(
      `<p class='message${self}'>
        <span class="username${self2}" style="color: ${data.color}">${
        data.username
      } : </span>
        ${data.message}</p>`
    );
    myScroll(chatroom);
    feedback.html("");
  });

  message.bind("keypress", e => {
    if (e.which != 13 && e.which != 32) {
      socket.emit("typing", { id: socket.id });
    }
  });

  socket.on("typing", data => {
    if (data.id != socket.id) {
      feedback.html(`<p><i>${data.username} is typing...</i></p>`);
    }
  });

  socket.on("user_left", data => {
    chatroom.append(`<p class='message reg'>
    <span style="color: ${data.color}; font-weight:bold">${
      data.username
    }</span> left. </p>`);
    myScroll(chatroom);
  });
});
