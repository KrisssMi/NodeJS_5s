// Разработайте приложение 03-05 на основе приложения 03-02, но функцию для вычисления факториала
// реализуйте асинхронной с помощью механизма setImmediate.
// Выполните аналогичные заданию 3 замеры.
// Результаты вычислений должны иметь следующий вид t-k/fac, где t – количество миллисекунд прошедшее с момента начала работы  цикла запросов,
// k – параметр пересылаемый серверу, fac факториал k.
var http = require("http");
var url = require("url");
var fs= require("fs");

function factorial(k) {     // рекурсивный алгоритм
    if (k == 0)
        return 1;
    else
        return k * factorial(k - 1);
}

function Fact(n, cb) {
    this.fn = n;
    this.ffact = factorial;
    this.fcb = cb;
    this.calc = (n) => {setImmediate(() => {this.fcb(null, this.ffact(this.fn));});}
}

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var rc = JSON.stringify({k: 0});
    if (path == "/fact") {
        if (typeof url.parse(req.url, true).query.k != "undefined") {
            var k = parseInt(url.parse(req.url, true).query.k);
            if (Number.isInteger(k)) {
                res.writeHead(200, {"Content-Type": "application/json"});
                var fact = new Fact(k, (err, result) => {res.end(JSON.stringify({k:k, fact: result}));})
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

console.log("Server №5 starts on http://localhost:5000");