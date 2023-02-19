// Разработайте серверное приложение 03-02, которое на GET-запрос вида  http://localhost:5000/fact?k=3 возвращает ответ, в теле которого содержится  сообщение в json-формате вида {k:3, fact:6}, где k – полученное в качестве параметра значение, а fact – значение факториала.
// Для расчета факториала используйте рекурсивный алгоритм.
// Проверьте работоспособность приложения с помощью POSTMAN.
const http=require('http');
const url = require('url');

function factorial(k) {
    if (k == 0)
        return 1;
    else
        return k * factorial(k - 1);
}

http.createServer(function (req, res) {
    var url_path = url.parse(req.url, true);       // url.parse - разбирает URL-адрес и возвращает объект URL, req.url - строка URL, которую необходимо разобрать
    var query = url_path.query;                                 // query - нужен для получения параметров запроса
    var k = query.k;                                 
    var fact_value = factorial(k);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({k: k, fact: fact_value}));
}).listen(5000);

console.log("Server №2 starts on http://localhost:5000/fact?k=3");