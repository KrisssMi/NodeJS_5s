const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

const httpServer = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/start') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index.html').pipe(res);
    } else {
        res.statusCode = 400;
        res.end();
    }
});

httpServer.listen(3000, () => {
    console.log('HTTP-сервер запущен на http://localhost:3000/start');
});


var k=0;
const wsServer = new WebSocket.Server({port: 4000, host: 'localhost', path: '/ws'});
wsServer.on('connection', (ws) => {
    var n;
    ws.on('message', (message) => {
        console.log(`10-01-client: ${message}`);
        n=message;
    });
    setInterval(() => {
        ws.send(`10-01-server: ${n} -> ${++k}`);
    }, 5000);
})
wsServer.on('error', (err) => {console.log('Error: ', err)});

console.log(`WS-сервер запущен на http://${wsServer.options.host}:${wsServer.options.port}${wsServer.options.path}`);