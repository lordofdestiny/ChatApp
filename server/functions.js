function rainbow(numOfSteps, step) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  var r, g, b;
  var h = step / numOfSteps;
  var i = ~~(h * 6);
  var f = h * 6 - i;
  var q = 1 - f;
  switch (i % 6) {
    case 0:
      r = 1;
      g = f;
      b = 0;
      break;
    case 1:
      r = q;
      g = 1;
      b = 0;
      break;
    case 2:
      r = 0;
      g = 1;
      b = f;
      break;
    case 3:
      r = 0;
      g = q;
      b = 1;
      break;
    case 4:
      r = f;
      g = 0;
      b = 1;
      break;
    case 5:
      r = 1;
      g = 0;
      b = q;
      break;
  }
  var c =
    "#" +
    ("00" + (~~(r * 255)).toString(16)).slice(-2) +
    ("00" + (~~(g * 255)).toString(16)).slice(-2) +
    ("00" + (~~(b * 255)).toString(16)).slice(-2);
  return c;
}

function urlify(text) {
  var urlRegex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  return text.replace(urlRegex, url => {
    return `<a href="${url}">${url}</a>`;
  });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

function getColors(size) {
  let colors = [];
  for (let i = 0; i < size; i++) {
    color = rainbow(15, i + 1);
    colors[i] = { color: color, used: false };
  }
  return colors;
}

function findFree(colors, size) {
  for (let i = 0; i < size; i++) {
    if (!colors[i].used) return i;
  }
  return -1;
}

function generateUsers(clients) {
  let object = clients.server.sockets.connected;
  let all = [];
  let i = 0;
  for (var prop in object) {
    let sct = object[prop];
    if (sct.connected) {
      all[i] = { id: sct.id, color: sct.color, username: sct.username };
      i++;
    }
  }
  return all;
}

module.exports = {
  rainbow,
  urlify,
  getColors,
  findFree,
  generateUsers
};