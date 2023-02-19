// Доработайте приложение 03-02 таким образом, чтобы на GET-запрос приложение отправляло HTML-страницу,
// содержимое которой формировалось бы с помощью JS.
const http = require('http');
const url = require('url');
const fs = require('fs');

function factorial(k) {         // рекурсивный алгоритм
    if (k == 0)
        return 1;
    else
        return k * factorial(k - 1);
}

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;      // url.parse - разбирает URL-адрес и возвращает объект URL, pathname - часть URL-адреса, которая идет после домена (нужна для получения пути к файлу)
    var rc = JSON.stringify({k: 0});             // rc - результат вычисления факториала
    if (path == "/fact") {
        if (typeof url.parse(req.url, true).query.k != "undefined") {  
            var k = parseInt(url.parse(req.url, true).query.k);
            if (Number.isInteger(k)) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify({k: k, fact: factorial(k)}));
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

console.log("Server №3 starts on http://localhost:5000");