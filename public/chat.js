$(function() {
  // const socket = io.connect("http://localhost");

  const socket = io();

  const $message = $("#message");
  const $username = $("#username");
  const $send_message = $("#send-message");
  const $send_username = $("#send-username");
  const $chatroom = $("#chatroom");
  const $refresh = $(".refresh");
  const $scroll = $("#scroll-bottom");
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

  $scroll.click(() => {
    myScroll($chatroom);
  });

  $chatroom.scroll(() => {
    const threshold =
      $chatroom[0].scrollHeight -
      $chatroom.outerHeight() -
      $chatroom.scrollTop();
    if (threshold >= $chatroom.outerHeight() / 2) {
      $scroll.css("display", "flex");
    } else {
      $scroll.css("display", "none");
    }
  });

  socket.on("refresh_list", data => {
    $users.empty();
    const size = data.length - 1;
    $("#count").text(size);
    for (const user of data) {
      if (socket.id != user.id) {
        $users.append(generateListDiv(user));
      }
    }
  });

  socket.on("new_user", data => {
    //displayNewUserPopup(data);
    $chatroom.append(makeELMessage(data, "joined"));
    myScroll($chatroom);
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
    $chatroom.append(makeMessage(data, socket));

    myScroll($chatroom);
    $(`#${data.id}`).text("");
    if (!focused) {
      messageCount++;
      $.titleAlert(`(${messageCount}) New chat message!`, {
        requireBlur: false,
        stopOnFocus: true,
        duration: 5000,
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
    $(`#${data.id}`).text("");
  });

  socket.on("user_left", data => {
    $chatroom.append(makeELMessage(data, "left"));
    myScroll($chatroom);
  });
});
