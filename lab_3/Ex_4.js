// Разработайте приложение 03-04 на основе приложения 03-02,
// но функцию для вычисления факториала реализуйте асинхронной с помощью механизма process.nextTick.
// Выполните аналогичные заданию 3 замеры.
var http = require("http");
var url = require("url");
var fs= require("fs");

function factorial(k) {     // рекурсивный алгоритм
    if (k == 0)
        return 1;
    else
        return k * factorial(k - 1);
}

function Fact(n, cb) {          // асинхронный алгоритм
    this.fn = n;
    this.ffact = factorial;     // ссылка на функцию вычисления факториала
    this.fcb = cb;              // ссылка на callback-функцию
    this.calc = (n) => {process.nextTick(() => {this.fcb(null, this.ffact(this.fn));});}    // асинхронный вызов callback-функции с вычисленным факториалом
}

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var rc = JSON.stringify({k: 0});
    if (path == "/fact") {
        if (typeof url.parse(req.url, true).query.k != "undefined") {
            var k = parseInt(url.parse(req.url, true).query.k);
            if (Number.isInteger(k)) {
                res.writeHead(200, {"Content-Type": "application/json"});
                var fact = new Fact(k, (err, result) => {res.end(JSON.stringify({k:k, fact: result}));})                            // создание объекта fact и передача ему параметров k и callback-функции для вывода результата вычисления факториала в виде JSON-строки в браузер
                fact.calc();
            }
        }
    }
    else if (path == "/") {
        var index = fs.readFileSync("./index.html");
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(index);
    }
    else {
        res.end(rc);
    }
}).listen(5000);

console.log("Server №4 starts on http://localhost:5000");