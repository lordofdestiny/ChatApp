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
  socket.emit(
    "new_message",
    {
      message: text
    } /* , data => {
    if (!data.ok) {
      alert("Sending failed!");
    } else {
      alert(data.message);
    }
  } */
  );
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
  $chatroom.animate({ scrollTop: $chatroom.prop("scrollHeight") }, "fast");
}

function toggleFavicon(flag) {
  const string = flag ? "icon" : "message";
  const $favicon = $(`link[rel="${string}"]`);
  if (flag) {
    $favicon.attr("href", "message.ico");
    $favicon.attr("rel", "message");
  } else {
    $favicon.attr("href", "favicon.ico");
    $favicon.attr("rel", "icon");
  }
}

function makeMessage(data, socket) {
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

  return div;
}

function makeELMessage(data, state) {
  const time = `<p class="time">${moment().format("HH : mm")}</p>`;
  const name = `<span style="color: ${data.color}; font-weight:bold">
                  ${data.username}
                </span>`;
  return `<div class='message reg'>
            <p class="message">${name}has ${state}.</p>
            ${time}
          </div>`;
}

// function displayNewUserPopup(user) {
//   $(".popup")[0].children.text.innerHTML = `${user.username} has joined!`;
//   console.log(user);
// }
