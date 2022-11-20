import { WebSocketServer } from 'ws';
var port = 8080;
const server = new WebSocketServer({ port: 8080 });
let host;
server.on('connection', ws => {
    if (typeof host === 'undefined') {
        host = ws;
        ws.send('HOST');
    }
    else {
        ws.send('CLIENT');
    }
    ws.on('message', message => {
        console.log(message);
        server.clients.forEach(client => {
            if (client !== ws) {
                client.send(message);
            }
        });
    });
});
//# sourceMappingURL=server.js.map