var http=require('http');
const route = 'api/name'; 

http.createServer(function(request, response)
{
    if (request.url==='/'+route){                                                   
        response.writeHead(200, {'Content-Type': 'text/plain, charset=utf-8'});     
        response.end('Minevich Kristina Viktorovna');                             
    }
}).listen(5000)
console.log('http://localhost:5000/'+route);