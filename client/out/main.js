var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ws = new WebSocket('ws://localhost:8080');
ws.addEventListener('open', function open() {
});
let role;
let done = false;
let sent_offer = false;
ws.addEventListener('message', function message(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (role === undefined) {
            console.log("It wasn't defined");
            role = message.data;
            if (role === 'CLIENT') {
                step_1_initiator_create_offer();
                sent_offer = true;
            }
        }
        else {
            if (role === 'CLIENT') {
                let txt = yield message.data.text();
                console.log('step 4 ', txt);
                step_4_accept_answer(txt);
            }
            else {
                let txt = yield message.data.text();
                console.log('Got here with ', txt);
                step_2_accept_remote_offer(txt);
            }
        }
        console.log('received: %s', message.data);
    });
});
let channel = null;
const connection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
connection.ondatachannel = (event) => {
    console.log('ondatachannel');
    channel = event.channel;
    // channel.onopen = event => console.log('onopen', event);
    // channel.onmessage = event => console.log('onmessage', event);
    channel.onmessage = (event) => alert(event.data);
    if (role === 'CLIENT') {
        channel.onopen = function (event) {
            var readyState = channel.readyState;
            if (readyState == "open") {
                channel.send("Hello");
            }
        };
    }
};
connection.onconnectionstatechange = (event) => console.log('onconnectionstatechange', connection.connectionState);
connection.oniceconnectionstatechange = (event) => console.log('oniceconnectionstatechange', connection.iceConnectionState);
function step_1_initiator_create_offer() {
    return __awaiter(this, void 0, void 0, function* () {
        channel = connection.createDataChannel('data');
        // channel.onopen = event => console.log('onopen', event)
        // channel.onmessage = event => console.log('onmessage', event)
        channel.onmessage = (event) => alert(event.data);
        connection.onicecandidate = (event) => {
            // console.log('onicecandidate', event)
            if (!event.candidate) {
                ws.send(JSON.stringify(connection.localDescription));
            }
        };
        const offer = yield connection.createOffer();
        yield connection.setLocalDescription(offer);
    });
}
function step_2_accept_remote_offer(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const offer = JSON.parse(data);
        yield connection.setRemoteDescription(offer);
        connection.onicecandidate = (event) => {
            // console.log('onicecandidate', event)
            if (!event.candidate) {
                ws.send(JSON.stringify(connection.localDescription));
            }
        };
        const answer = yield connection.createAnswer();
        yield connection.setLocalDescription(answer);
    });
}
function step_4_accept_answer(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = JSON.parse(data);
        yield connection.setRemoteDescription(answer);
    });
}
//# sourceMappingURL=main.js.map