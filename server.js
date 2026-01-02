const WebSocket = require('ws');

const PORT = process.env.PORT || 10000;  // Render가 포트를 지정함
const wss = new WebSocket.Server({ port: PORT });

let unityClient = null;

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);

      if (msg.type === 'unity') {
        unityClient = ws;
        console.log('Unity client registered');
      } else if (msg.type === 'sensor' && unityClient) {
        unityClient.send(JSON.stringify(msg.data));
      }
    } catch (err) {
      console.error('Parsing error:', err);
    }
  });

  ws.on('close', () => {
    if (ws === unityClient) {
      unityClient = null;
      console.log('Unity client disconnected');
    }
  });
});
