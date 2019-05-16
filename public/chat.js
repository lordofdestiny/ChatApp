$(function() {
  const socket = io.connect("http://localhost:3000");

  const $message = $("#message");
  const $username = $("#username");
  const $send_message = $("#send-message");
  const $send_username = $("#send-username");
  const $chatroom = $("#chatroom");
  const $refresh = $(".refresh");
  const $users = $("#users");
  const $title = $("title");
  const titleDefault = $title.text();

  let focused = true;
  let messageCount = 0;

  window.onfocus = function() {
    focused = true;
    messageCount = 0;
    $title.text(titleDefault);
    toggleFavicon(false);
  };

  window.onblur = function() {
    focused = false;
  };

  $refresh.click(() => {
    socket.emit("refresh_list");
    $refresh.rotate();
  });

  socket.on("refresh_list", data => {
    $users.empty();
    const size = data.length - 1;
    $("#count").replaceWith(`<span id="count">${size}</span>`);
    for (let user of data) {
      if (socket.id != user.id) {
        $users.append(generateListDiv(user));
      }
    }
  });

  $send_username.click(() => {
    sendUsername($username, socket);
    currentUsername = $username.val();
  });

  $username.keypress(e => {
    if (e.which == 13) {
      sendUsername($username, socket);
      currentUsername = $username.val();
    }
  });

  $send_message.click(() => {
    sendMessage($message, socket);
  });

  $message
    .keypress(e => {
      if (e.which == 13 && !e.shiftKey && !$message.val().length <= 500) {
        sendMessage($message, socket);
      }
    })
    .keyup(e => {
      if (e.which == 13 && !e.shiftKey) {
        $message.val("");
      }
    })
    .keydown(() => {
      if ($message.val().length == 500) {
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
    const time = `${moment().format("HH : mm")}`;
    const self = data.id === socket.id ? " self" : " reg";
    const self2 = data.id === socket.id ? " self2" : "";

    const p = `<p class="message">
                <span class="username${self2}" style="color: ${data.color}">
                ${data.username} : </span>
                ${data.message}
              </p>`;

    const vreme = `<p class="time">${time}</p>`;

    const div = `<div class="message${self}">
                  ${p} ${vreme}
                </div>`;

    $chatroom.append(div);

    myScroll($chatroom);
    $(`#${data.id}`).text("");
    if (!focused) {
      messageCount++;
      $.titleAlert(`(${messageCount}) New chat message!`, {
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

  $message.bind("keyup", e => {
    if (e.which != 13 && e.which != 32 && e.target.value !== "") {
      socket.emit("typing", { id: socket.id });
    }
    if (e.target.value === "") {
      socket.emit("stop_typing", { id: socket.id });
    }
  });

  socket.on("typing", data => {
    $(`#${data.id}`).text("is typing...");
  });

  socket.on("stop_typing", data => {
    console.log(data.id);
    $(`#${data.id}`).text("");
  });

  socket.on("user_left", data => {
    $chatroom.append(`<div class='message reg'>
    <p class="message">
    <span style="color: ${data.color}; font-weight:bold">${
      data.username
    }</span> has left.</p>
    <p class="time">${data.time}</p>
    </div>`);
    myScroll($chatroom);
  });
});
