const WebSocket = require("ws");

const wss = new WebSocket.Server({
  port: 5000,
  host: "localhost",
  path: "/broadcast",
});

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`10-03-client: ${message}`);
    wss.clients.forEach((client) => {                                       // forEach - перебор всех клиентов в массиве 
      if (client.readyState === WebSocket.OPEN) {   
        client.send("server: " + message);
        console.log(message);
      }
    });
  });
});

wss.on("error", (err) => {
    console.log("Error: ", err);
});
console.log("WS-сервер запущен на http://localhost:5000/broadcast");