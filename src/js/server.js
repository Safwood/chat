const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080
});

const users = {
  type: "allUsers",
  body: []
};

const { v4: uuidv4 } = require('uuid');

//var userId = 1000;
//const online = {};

wss.on('connection', function(wsParams) {
  const userId = uuidv4();
  //console.log('user connect: ' + userId);
  let nick;

  wsParams.on('message', function(data) {
    const request = JSON.parse(data);
   
    switch (request.type) {
      case 'loginName':
        users.body.push({
          name: request.name,
          nick: request.nick,
          online: true,
          id: userId
        })

        wss.clients.forEach(client => {
          client.send(data);
          client.send(JSON.stringify(users));
          
        });

      break;
      case 'message':
        wss.clients.forEach(client => {
          client.send(data);
        });
       
      break;
      case 'userDelete':
        users.body.forEach(user => {
          if (user.id == request.id) {
            console.log('да');
            user.online = 'undefined';
            console.log(users)
          }
        })
       
      break;
      default: console.error('Unknown response type')
      break;
    }
  })

  wsParams.on('close', function (data) {
    console.log('client disconnect');

    users.body.forEach(user => {
      if (user.id === userId) {
        user.online = false;
        wss.clients.forEach(client => {
          client.send(JSON.stringify(users));
        });
      }
    })
    
  })
})