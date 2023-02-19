const http = require("http");
const fs = require("fs");
const url = require("url");
var database = require("./db.js");

var db = new database.DB();

db.on("GET", (req, res) => {
  console.log("GET");
  db.select().then((data) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  });
});

db.on("POST", (req, res) => {
  console.log("POST");
  req.on("data", (data) => {
    let r = JSON.parse(data);

    db.insert(r)
      .then((result) => {
        res.end(JSON.stringify(result));
      })
      .catch((err) => {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      });
  });
});

db.on("PUT", (req, res) => {
  console.log("PUT");
  req.on("data", (data) => {
    let r = JSON.parse(data);
    db.update(r)
      .then((result) => {
        res.end(JSON.stringify(result));
      })
      .catch((err) => {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      });
  });
});

db.on("DELETE", (req, res) => {
  var url = new URL("http://localhost:5000" + req.url); // получение URL из запроса req
  var id = parseInt(url.searchParams.get("id"));
  console.log("DELETE");
  db.delete(id)
    .then((result) => {
      res.end(JSON.stringify(result));
    })
    .catch((err) => {
      res.statusCode = 400;
      res.end(JSON.stringify(err));
    });
});

http
  .createServer((req, res) => {
    if (url.parse(req.url).pathname === "/") {
      var html = fs.readFileSync("./index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } else if (url.parse(req.url).pathname === "/api/db") {
      db.emit(req.method, req, res); // генерация события, имя события - строка req.method
    }
  })
  .listen(5000);

console.log("Server starts on http://localhost:5000");
