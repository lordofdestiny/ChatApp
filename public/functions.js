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
    username: username.val(),
    url: ValidURL(text)
  });
  message.val("");
}

function generateEmptyString(len) {
  var string = "";
  for (let i = 0; i < len; i++) {
    string += "&nbsp;";
  }
  return string;
}

function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if (!regex.test(str)) {
    return false;
  } else {
    return true;
  }
}
