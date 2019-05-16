function sendUsername($username, socket) {
  if ($username.val() === "") {
    alert("You have to enter username!");
    return;
  }
  socket.emit("change_username", { username: $username.val() });
  $(".change-username").hide();
  $("#loggedin").show();
  $("#loggedInUsername").text($username.val());
}

function sendMessage($message, socket) {
  const text = $message.val().trim();
  if (text === "") {
    alert("You can't send an empty message!");
    return;
  }
  socket.emit("new_message", {
    message: text
  });
  $message.val("");
  $message.scrollTop(0);
}

function generateListDiv(data) {
  const d1 = `<div class="user" style="color:${data.color}">${
    data.username
  }</div>`;

  const d2 = `<div class="id" id="${data.id}"></div>`;
  return `<div  class="userWrapper">${d1}${d2}</div>`;
}

function myScroll($chatroom) {
  $chatroom.animate({ scrollTop: $("#chatroom").prop("scrollHeight") }, "fast");
}

function toggleFavicon(flag) {
  const string = flag ? "icon" : "message";
  const $favicon = $(`link[rel="${string}"]`);
  if (flag) {
    $favicon.attr("href", "message.ico");
    $favicon.attr("rel", "message");
    console.log("executed");
  } else {
    $favicon.attr("href", "favicon.ico");
    $favicon.attr("rel", "icon");
  }
}
