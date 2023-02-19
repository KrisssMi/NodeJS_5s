var http=require('http');
var fs=require('fs'); 

http.createServer(function(request, response)
{
    let html=fs.readFileSync('./file.html');                                // считываем файл в буферный объект, буферный объект - это объект, который содержит данные из файла
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});  
    response.end(html);
}).listen(5000);

console.log('http://localhost:5000/html');