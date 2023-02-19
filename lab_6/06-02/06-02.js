process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const http = require("http");
const url = require("url");
const fs = require("fs");
const SendMessageByMail = require("./06-02-Mail.js");

const PORT = 3000;

http
  .createServer((request, responce) => {
    const path = url.parse(request.url);
    if (path.pathname === "/") {
      switch (request.method) {
        case "GET":
          fs.readFile("index.html", (err, data) => {
            if (err) {
              console.log(err.message);
              return;
            }
            responce.end(data);
          });
          break;
        case "POST":
          let body;
          request.on("data", (chunk) => {
            body = JSON.parse(chunk);
          });

          request.on("end", () => {
            SendMessageByMail(body.from, body.password, body.to, body.message);
          });
          break;
      }
    }
  })
  .listen(PORT, () => console.log(`Server started on port ${PORT}...`));
