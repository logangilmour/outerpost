"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var port = 8080;
var server = new WebSocket.WebSocketServer({ port: 8080 });
server.on('connection', function (ws) {
    console.log("CONNECTION");
    ws.on('message', function (message) {
        console.log(message);
        ws.send("Yo");
    });
});
//# sourceMappingURL=server.js.map