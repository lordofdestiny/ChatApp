$(function() {
  var socket = io.connect("http://localhost:3000");

  var message = $("#message");
  var username = $("#username");
  var send_message = $("#send_message");
  var send_username = $("#send_username");
  var chatroom = $("#chatroom");
  var refresh = $(".refresh");
  var users = $("#users");
  var focused = true;
  var messageCount = 0;
  var title = $("title");
  var titleDefault = title.text();

  window.onfocus = function() {
    focused = true;
    messageCount = 0;
    title.text(titleDefault);
    toggleFavicon(false);
  };

  window.onblur = function() {
    focused = false;
  };

  refresh.click(() => {
    socket.emit("refreshList");
    refresh.rotate();
  });

  socket.on("refreshList", data => {
    users.empty();
    let size = data.length - 1;
    $("#count").replaceWith(`<span id="count">${size}</span>`);
    for (let user of data) {
      if (socket.id != user.id) {
        users.append(generateListDiv(user));
        //isTyisTyping[user.id] = false;
      }
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

  message
    .keypress(e => {
      if (e.which == 13 && !e.shiftKey && !message.val().length <= 500) {
        sendMessage(message, socket);
      }
    })
    .keyup(e => {
      if (e.which == 13 && !e.shiftKey) {
        message.val("");
      }
    })
    .keydown(() => {
      console.log(message.val().length);
      if (message.val().length == 500) {
        alert("Maximum message duration is 500 characters!");
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
    $(`#${data.id}`).text("");
    if (!focused) {
      messages++;
      $.titleAlert(`(${messages}) New chat message!`, {
        requireBlur: false,
        stopOnFocus: true,
        duration: 4000,
        interval: 700
      });
    }
    if (data.id != socket.id) {
      toggleFavicon(true);
    }
  });

  message.bind("keypress", e => {
    if (e.which != 13 && e.which != 32) {
      socket.emit("typing", { id: socket.id });
    }
  });

  socket.on("typing", data => {
    $(`#${data.id}`).text("is typing...");
  });

  socket.on("user_left", data => {
    chatroom.append(`<p class='message reg'>
    <span style="color: ${data.color}; font-weight:bold">${
      data.username
    }</span> has left. </p>`);
    myScroll(chatroom);
  });
});
