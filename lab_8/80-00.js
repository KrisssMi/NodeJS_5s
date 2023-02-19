const http = require("http");
const fs = require("fs");
const url = require("url");
const multiparty = require('multiparty');

const server = http.createServer((req, res) => {
    switch (req.method) {
      case "GET":
        getHandler(req, res);
        break;
      case "POST":
        postHandler(req, res);
        break;
      default:
        res.statusCode = 405;
        break;
    }
  }).listen(5000, () => console.log("Start server at http://localhost:5000"));

function getHandler(req, res) {
  const path = url.parse(req.url, true);

  switch (path.pathname) {
    case "/connection": {
      if (path.query?.set) {
        server.keepAliveTimeout = +path.query.set;  
        const statusCode = 200;
        res.writeHead(statusCode, { "Content-Type": "text/plain" });
        res.end(`KeepAliveTimeout set to ${server.keepAliveTimeout}`);
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`KeepAliveTimeout is ${server.keepAliveTimeout}`);
      }
      break;
    }

    case "/headers": {
      res.setHeader("X-university", "BSTU");
      res.setHeader("X-faculty", "IT");
      res.setHeader("X-course", "3");
      res.setHeader("X-group", "4");
      res.setHeader("X-student", "Kristina Minevich");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

      var head = "";
      res.write("<h1>Request headers: </h1>");
      for (key in req.headers) {
        head += "<p>" + key + ": " + req.headers[key];
      }
      res.write(head);
      res.write("<h1>Response headers: </h1>");

      head = "";
      for (key in Object.values(res.getHeaders())) {
        head +=
          "<p>" +
          Object.values(res.getHeaderNames())[key] +
          ": " +
          Object.values(res.getHeaders())[key];
      }
      res.end(head);
      break;
    }

    case "/parameter": {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      if (req.url.toString().includes("?")) {
        if (
          typeof url.parse(req.url, true).query.x != "undefined" ||
          typeof url.parse(req.url, true).query.y != "undefined"
        ) {
          var x = parseInt(url.parse(req.url, true).query.x); 
          var y = parseInt(url.parse(req.url, true).query.y);
          if (Number.isInteger(x) && Number.isInteger(y)) {
            res.write("<h2>Сумма: " + (x + y) + "</h2>");
            res.write("<h2>Разность: " + (x - y) + "</h2>");
            res.write("<h2>Произведение: " + x * y + "</h2>");
            res.end("<h2>Деление: " + x / y + "</h2>");
          } else {
            res.end("<h2>Error</h2>");
          }
        }
      }
      break;
    }

    case "/close": {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Сервер остановится через 10 секунд</h1>"); 
      timer = setTimeout(() => {
        server.close();
        process.exit();
      }, 10000);
      break;
    }

    case "/socket": {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<h2> client address ${req.connection.remoteAddress}
        client port: ${req.connection.remotePort}</h2>
        <h2> server address ${req.socket.localAddress} 
        server port: ${req.socket.localPort}</h2>`);
      break;
    }

    case "/req-data": {
      req.on("data", (data) => {
        console.log("PART");
        res.write(data);
      });
      req.on("end", () => {
        res.end();
      });
      break;
    }

    case "/resp-status": {
      const code = path.query.code, 
        mess = path.query.mess;
      if (code && mess) {
        res.statusCode = code;
        res.statusMessage = mess;
      }
      console.log("/resp-status");
      console.log(
        "Code: " + res.statusCode + ", message: " + res.statusMessage
      );
      res.end(`code: ${code}; mess: ${mess}`);
      break;
    }

    case "/formparameter": {
      fs.createReadStream("form.html").pipe(res);             // потоковое чтение (передача данных из одного потока в другой)
      break;
    }

    case "/files": {
      fs.readdir("./static", (err, files) => {                
        res.setHeader("X-static-files-count", files.length);  
        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
        res.end(`X-static-files-count: ${files.length}`);
    });
    break;
    }

    case "/upload": {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fs.readFileSync("static/upload.html"));
      break;
    }

    default: {
      const parameterPattern = new RegExp("^\\/parameter\\/(.+)\\/(.+)$");
      if (parameterPattern.test(path.pathname)) {
        const arrayPath = path.pathname.slice(1).split("/");
        const x = +arrayPath[1],
          y = +arrayPath[2];
        if (Number.isInteger(x) && Number.isInteger(y)) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.write("<h2>Сумма: " + (x + y) + "</h2>");
          res.write("<h2>Разность: " + (x - y) + "</h2>");
          res.write("<h2>Произведение: " + x * y + "</h2>");
          res.end("<h2>Деление: " + x / y + "</h2>");
        } else {
          res.end(req.url);
        }
        break;
      }

    if (path.pathname.slice(1).split("/")[0] === "files") {
      let arrayPath = path.pathname.slice(1).split("/");
      let fileName = arrayPath[1];  
      if (fs.existsSync(`./static/${fileName}`)) {
        fs.access(`./static/${fileName}`, fs.constants.R_OK, () => {  
          res.writeHead(200, {"Content-Type": "application/txt; charset=utf-8"});
          fs.createReadStream(`./static/${arrayPath[1]}`).pipe(res);  //потоковое чтение
        });
      } else {
        res.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
        res.end("<h1>404 Not Found</h1>");
      }
      break;
    }
  }
}
}
    

function postHandler(req, res) {
  const path = url.parse(req.url, true);

  switch (path.pathname) {
    case "/formparameter": {
      res.writeHead(200, { "Content-Type": "text/plain" });
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        console.log(data);
        res.end(data);
      });
      break;
    }

    case "/json": {
      var body = [];
      req
        .on("data", (chunk) => {
          body = chunk.toString();
          body = JSON.parse(body);
        })
        .on("end", () => {
          res.end(
            JSON.stringify({
              _comment: "Ответ: " + body.comment,
              x_plus_y: body.x + body.y,
              concat_s_o: body.s + ": " + body.o.surname + " " + body.o.name,
              length_m: body.m.length,
            })
          );
        });
      break;
    }

    case "/xml": {
      var parseString = require("xml2js").parseString;
      var xmlbuilder = require("xmlbuilder");
      var body = [];
      var sum = 0;
      var concat = "";
      var id = "";

      req
        .on("data", (chunk) => {
          body = chunk.toString();
        })
        .on("end", () => {
          parseString(body, function (err, result) {  
            if (err) console.log("Error");
            else {
              id = result.request.$.id;    
              result.request.x.forEach((elem) => {
                sum += parseInt(elem.$.value);
              });
              result.request.m.forEach((elem) => {
                concat += elem.$.value;
              });
              var xmldoc = xmlbuilder
                .create("response")
                .att("id", "33")
                .att("request", id);
              xmldoc.ele("sum").att("element", "x").att("result", sum);
              xmldoc.ele("concat").att("element", "m").att("result", concat);
              res.end(xmldoc.toString());
            }
          });
        });
      break;
    }

    case "/upload": {
      let form = new multiparty.Form({uploadDir: "./static"})
      form.on("file", (name, file) => {
        console.log(
          `name = ${name}; original filename: ${file.originalFilename}; path = ${file.path}`
        );
      });
      form.on("error", (err) => {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(`${err}`);
      });
      form.on("close", () => {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Файл получен");
      });
      form.parse(req);
      break;
    }
  }
}