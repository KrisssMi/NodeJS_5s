const http=require('http');
const head=(request) => {         // Чтение заголовков
    let rc='';
    for (key in request.headers)
    rc+='<h3>'+key+':'+request.headers[key]+'</h3>';
    return rc;
}

http.createServer((request, response) =>
{
    let b='';
    request.on('data', (str) => {               // стрелочная функция с одним параметром str, которая является прослушкой
        b+=str; console.log('data', b);
    })                                                                          

    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); 

    request.on('end', () => response.end(      // стрелочная функция с одним параметром, которая является прослушкой
        '<!DOCTYPE html> <html><head></head>'+
        '<body style="background-color: pink">' +
        '<h1>Структура запроса:</h1>'+
        '<h2>'+ 'Метод:' + request.method +'</h2>'+
        '<h2>'+ 'URI:' + request.url +'</h2>'+
        '<h2>'+ 'Версия:' + request.httpVersion +'</h2>'+
        '<h2>'+ 'Заголовки:'  +'</h2>'+
        head(request) +
        '<h2>' +'тело:' + b +'</h2>'+
        '</body>'+
        '</html>'));
}).listen(3000); 
console.log('Server running at http://localhost:3000/')