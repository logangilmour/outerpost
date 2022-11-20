import WebSocket = require('ws');

var port: number = 8080;

var server = new WebSocket.WebSocketServer({port: 8080});

server.on('connection', ws=>{
    console.log("CONNECTION");
    ws.on('message', message =>{
        console.log(message);
        ws.send("Yo");
    })
})