function rainbow(numOfSteps, step) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  let r, g, b;
  const h = step / numOfSteps;
  const i = ~~(h * 6);
  let f = h * 6 - i;
  let q = 1 - f;
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
  const c =
    "#" +
    ("00" + (~~(r * 255)).toString(16)).slice(-2) +
    ("00" + (~~(g * 255)).toString(16)).slice(-2) +
    ("00" + (~~(b * 255)).toString(16)).slice(-2);
  return c;
}

function urlify(text) {
  const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  return text.replace(urlRegex, url => {
    return `<a href="${url}">${url}</a>`;
  });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

function getColors(size) {
  let colors = [];
  for (let i = 0; i < size; i++) {
    colors.push({ color: rainbow(15, i), used: false });
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
  const object = clients.server.sockets.connected;
  let all = [];
  for (const prop in object) {
    const sct = object[prop];
    if (sct.connected) {
      all.push({ id: sct.id, color: sct.color, username: sct.username });
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
