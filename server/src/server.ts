import WebSocket, {WebSocketServer } from 'ws';

var port: number = 8080;

const server: WebSocketServer = new WebSocketServer({port: 8080});



let host: WebSocket | undefined;
server.on('connection', ws=>{
    if(typeof host === 'undefined'){
        host = ws;
        ws.send('HOST');
    }else{
        ws.send('CLIENT');
    }
    ws.on('message', message =>{
        console.log(message);
        server.clients.forEach(client=>{
            if(client!==ws){
                client.send(message);
            }
        })
    })
})