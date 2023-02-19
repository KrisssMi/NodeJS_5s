var http=require('http');                                                   // подключаем модуль http
var fs = require('fs');                                                     // подключаем модуль fs
let port=5000;

http.createServer((request, response) => {
    if (request.url == '/api/name') {                                       
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});  
        response.end('Minevich Kristina Viktorovna');
    }
    else if (request.url === '/jquery') {                           
        fs.readFile('jquery.html', (err,data)=>{                     
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); 
        response.end(data);                                                 
    });
}}).listen(5000);

console.log(`server is listening on ${port}`);
console.log('http://localhost:5000/jquery');