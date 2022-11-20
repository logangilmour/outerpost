const ws = new WebSocket('ws://localhost:8080');



ws.addEventListener('open', function open() {
});

let role : String | undefined;

let done : boolean = false;

let sent_offer : boolean = false;
ws.addEventListener('message', async function message(message) {
  if(role === undefined){
    console.log("It wasn't defined");
    role = message.data;
    if(role === 'CLIENT'){
      step_1_initiator_create_offer();
      sent_offer = true;
    }
  }else{
    if(role === 'CLIENT'){
      let txt = await message.data.text();
      console.log('step 4 ',txt);
    
      step_4_accept_answer(txt);
    }else{
      let txt = await message.data.text();
      console.log('Got here with ',txt);

      step_2_accept_remote_offer(txt);
    }
  }
  console.log('received: %s', message.data);
});


let channel = null

      const connection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })

      connection.ondatachannel = (event) => {
        console.log('ondatachannel')
        channel = event.channel
        // channel.onopen = event => console.log('onopen', event);
        // channel.onmessage = event => console.log('onmessage', event);
        channel.onmessage = (event) => alert(event.data)
      }

      connection.onconnectionstatechange = (event) =>  console.log('onconnectionstatechange', connection.connectionState)
      connection.oniceconnectionstatechange = (event) => console.log('oniceconnectionstatechange', connection.iceConnectionState)

      async function step_1_initiator_create_offer() {
        channel = connection.createDataChannel('data')
        // channel.onopen = event => console.log('onopen', event)
        // channel.onmessage = event => console.log('onmessage', event)
        channel.onmessage = (event) => alert(event.data)

        connection.onicecandidate = (event) => {
          // console.log('onicecandidate', event)
          if (!event.candidate) {
            ws.send(JSON.stringify(connection.localDescription));
          }
        }

        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
      }

      async function step_2_accept_remote_offer(data) {
        const offer = JSON.parse(data)
        await connection.setRemoteDescription(offer)

        connection.onicecandidate = (event) => {
          // console.log('onicecandidate', event)
          if (!event.candidate) {
            ws.send(JSON.stringify(connection.localDescription))
          }
        }

        const answer = await connection.createAnswer()
        await connection.setLocalDescription(answer)
      }


      async function step_4_accept_answer(data) {
        const answer = JSON.parse(data)
        await connection.setRemoteDescription(answer)
        channel.send("YO IT WORKED")
      }
