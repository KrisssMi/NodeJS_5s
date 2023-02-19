// Разработайте серверное приложение 03-01, которое на запрос http://localhost:5000
// возвращает  страницу, отражающую состояние приложения.

const http=require('http');

var state="<h3>norm</h3>";

http.createServer(function (req, res){
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(state);
}).listen(5000);

process.stdin.setEncoding("utf-8");                         // установка кодировки ввода
process.stdin.on("readable", () => {
    var command=null;
    while ((command=process.stdin.read()) != null) {
        if (command.trim() === "exit")                      // process.exit() - завершение процесса; trim() - удаляет пробельные символы с начала и конца строки
            process.exit(0);
        else if (command.trim()==="norm")
            state="<h3>norm</h3>";
        else if (command.trim()==="stop")
            state="<h3>stop</h3>";
        else if (command.trim()==="test")
            state="<h3>test</h3>";
        else if (command.trim()==="idle")
            state="<h3>idle</h3>";
    }
});
console.log("Server starts on http://localhost:5000");