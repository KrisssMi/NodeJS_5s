const http = require("http");
const fs = require("fs");
const url = require("url");
var database = require("./db.js");
var db = new database.DB();

class Statistic {
  ssEnabled = false;
  startDate = "";
  finishDate = "-";
  queriesCount = 0;
  commitsCount = 0;

  reset() {
    this.ssEnabled = true;
    this.startDate = "";
    this.finishDate = "-";
    this.queriesCount = 0;
    this.commitsCount = 0;
  }
}
const statistic = new Statistic();

db.on("GET", (req, res) => {
  console.log("GET");
  db.select().then((data) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
    statistic.queriesCount++;
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
  statistic.queriesCount++;
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
  statistic.queriesCount++;
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
  statistic.queriesCount++;
});

db.on("COMMIT", (req, res) => {
  if (statistic.ssEnabled) statistic.commitsCount++;
  console.log("COMMITTED");
});

var server = http
  .createServer((req, res) => {
    if (url.parse(req.url).pathname === "/") {
      var html = fs.readFileSync("./index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } else if (url.parse(req.url).pathname === "/api/db") {
      db.emit(req.method, req, res); // генерация события, имя события - строка req.method
    } else if (url.parse(req.url).pathname === "/api/ss") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(statistic));
    }
  })
  .listen(5000);

var timeriscreated = false; // флаг, показывающий, создан ли таймер
var intervaliscreated = false; // флаг, показывающий, создан ли интервал
var statiscreated = false; // флаг, показывающий, создан ли объект статистики
var timer = null;
var interval = null;
var stattimer = null;
var statinterval = null;

process.stdin.setEncoding("utf-8");
process.stdin.on("readable", () => {
  var command = null;
  while ((command = process.stdin.read()) !== null) {
    var state = command.toString().trim().split(" ");
    if (state[0] === "exit") {
      process.exit(0);
    }

    // Остановка сервера через заданный промежуток времени
    else if (state[0] == "sd") {
      if (timeriscreated) {
        console.log("Таймер выключения сервера был сброшен");
        if (state[1] != null) {
          console.log("Таймер выключения сервера был перезапущен");
          clearTimeout(timer); // очистка таймера
          timeriscreated = false;
          timer = setTimeout(() => {
            timeriscreated = false;
            timer.unref();
          }, state[1] * 1000);
          timeriscreated = true;
        } else {
          clearTimeout(timer);
          timeriscreated = false;
        }
      } else {
        if (state[1] != null) {
          console.log("Таймер выключения сервера был запущен");
          timer = setTimeout(() => {
            timeriscreated = false;
            clearTimeout(timer);
            server.close();
          }, state[1] * 1000).unref();
          process.stdin.unref();
          timeriscreated = true;
        }
      }

      // Периодическая фиксация БД
    } else if (state[0] === "sc") {
      if (intervaliscreated) {
        clearInterval(interval);
        intervaliscreated = null; // интервал удален
      }
      x = parseInt(state[1]);
      if (isNaN(x) === false && x > 0) {
        console.log(
          "Периодическая фиксация БД была запущена каждые " + x + " секунд"
        );
        interval = setInterval(() => {
          db.emit("COMMIT");
        }, x * 1000);
        intervaliscreated = true;
        interval.unref(); // не держать процесс в работе
      }
      // если параметра нет, то останавливается периодическая фиксация БД
      else if (state[1] == null) {
        console.log("Периодическая фиксация БД была остановлена");
        clearInterval(interval);
        intervaliscreated = null;
      }
    }

    // Сбор статистики
    else if (state[0] === "ss") {
      x = parseInt(state[1]);

      if (!x) {
        // если параметра нет, то останавливается сбор статистики
        console.log("Статистика была сброшена");
        stat = JSON.stringify();
        statiscreated = false;
        clearInterval(statinterval);
        clearTimeout(stattimer);
        statistic.ssEnabled = false;
      }

      if (isNaN(x) === false && x > 0) {
        if (statiscreated) {
          console.log("Статистика была перезапущена");
          clearInterval(statinterval);
          statiscreated = false;
          statinterval = null;
        }
        console.log("Статистика была запущена");
        if (stattimer == null) {
          // если таймер не создан - создаем
          statistic.reset();
          statistic.startDate = new Date().toLocaleTimeString();
          console.log(`Статистика включена в течение ${x} секунд`);
          statistic.ssEnabled = true;
          stattimer = setTimeout(() => {
            console.log("Статистика выключена");
            clearTimeout(stattimer);
            statistic.finishDate = new Date().toLocaleTimeString();
            statistic.ssEnabled = false;
            stattimer = null;
          }, x * 1000);
          stattimer.unref(); // не держать процесс в работе
        } else {
          // если таймер создан и запущен
          clearTimeout(stattimer);
          statistic.finishDate = new Date().toLocaleTimeString();
          statistic.ssEnabled = false;
          stattimer = null;
        }
      }
    }
  }
});

console.log("Server starts on http://localhost:5000");
