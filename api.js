module.exports = { getImages, getImageSrc };

// Get filenaem
// https://en.wikipedia.org/w/api.php?page=Template:POTD_protected/2020-08-23&format=json&action=parse
// https://en.wikipedia.org/w/api.php?page=Template%3APOTD_protected%2F2020-08-23..
// Get src
// https://commons.wikimedia.org/w/rest.php/v1/file/File:Common_blues_(Polyommatus_icarus)_mating,_male_(l)_and_female_(r).jpg
async function getImages(date = new Date()) {
  if (!date) date = new Date();
  const dateStr = typeof date === "string" ? date : dateToUTCString(date);
  const url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Template:POTD_protected/${dateStr}`;
  const json = await getJson(url);
  return json;
}

// getImages().then(console.log).catch(console.error);

async function getImageSrc(filename) {
  const url = "https://commons.wikimedia.org/w/rest.php/v1/file/File:" + filename;
  const json = await getJson(url);
  return json;
}

// getImages().then(fn => getImageSrc(fn[0]).then(console.log));

// 2020-08-23
function dateToUTCString(date) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  return [y.toString(), leftpad(m, 2), leftpad(d, 2)].join("-");
}

// leftpad(3, 2) => "03"
function leftpad(num, width, padding = "0") {
  let s = num.toString();
  const diff = width - s.length;
  if (diff > 0) {
    return padding.repeat(diff) + s;
  }
  return s;
}

function getJson(url, options) {
  console.log(`Fetching ${url} ...`);
  return new Promise((resolve, reject) => {
    const http = require(url.startsWith("https") ? "https" : "http");
    options = options || {};
    options.headers = options.headers || {};
    if (!options.headers["user-agent"]) {
      // github api requires this
      options.headers["user-agent"] = `Node.js ${process.version}`;
    }
    http.get(url, options, response => {
      console.log(response.statusCode);
      console.log(response.headers);
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(`HTTP error! status: ${response.statusCode}`));
        return;
      }
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("application/json")) {
        reject(new Error(`Response body is not JSON: ${contentType || "No Content-Type header"}`));
        return;
      }
      let body = "";
      response.on("data", chunk => body += chunk);
      response.on("end", () => {
        // console.log(body);
        resolve(JSON.parse(body));
      });
    }).on("error", error => {
      console.error(error);
      reject(error);
    })
  });
}

// getJson("https://api.github.com/").then(console.log).catch(console.error);
