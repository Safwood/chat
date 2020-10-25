const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080
});

wss.on('connection', function(wsParams) {

  wsParams.on('message', function(data) {
    
    const request = JSON.parse(data);
    switch (request.type) {
      case 'loginName':
        wsParams.send(data);
      break;
      case 'message':
        wsParams.send(data);
      break;
      default: console.error('Unknown response type')
      break;
    }
  })

})