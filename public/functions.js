function sendUsername(username, socket) {
  if (username.val() === "") {
    alert("You have to enter username!");
    return;
  }
  socket.emit("change_username", { username: username.val() });
  $("#change_username").hide();
  $("#section_username").append(
    `<p class="loggedin">You are logged in as:<br/> <b>${username.val()}</b></p>`
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
  message.scrollTop(0);
}

function generateListDiv(data) {
  let d1 = `<div class="user" style="color:${data.color}">${
    data.username
  }</div>`;

  let d2 = `<div class="id" id="${data.id}"></div>`;
  return `<div  class="userWrapper">${d1}${d2}</div>`;

  // return `<p class="user" id="${data.id}" style="color:${data.color}">${
  //   data.username
  // }</p>`;
}

function myScroll(chatroom) {
  chatroom.animate({ scrollTop: $("#chatroom").prop("scrollHeight") }, "fast");
}

function toggleFavicon(flag) {
  let string = flag ? "icon" : "message";
  let $favicon = $(`link[rel="${string}"]`);
  if (flag) {
    $favicon.attr("href", "message.ico");
    $favicon.attr("rel", "message");
    console.log("executed");
  } else {
    $favicon.attr("href", "favicon.ico");
    $favicon.attr("rel", "icon");
  }
}
