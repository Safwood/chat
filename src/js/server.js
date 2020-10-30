const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080
});

const users = {
  type: "allUsers",
  body: []
};

//var userId = 1000;
//const online = {};

wss.on('connection', function(wsParams) {
  //userId = ++userId;
  //console.log('user connect: ' + userId);
  let nick;

  wsParams.on('message', function(data) {
    const request = JSON.parse(data);
     nick = data.nick;

    switch (request.type) {
      case 'loginName':
        users.body.push({
          name: data.name,
          nick: data.nick,
          online: true
          //id: userId
        })

        wss.clients.forEach(client => {
          client.send(data);
          client.send(JSON.stringify(users));
          
        });

      break;
      case 'message':
        //console.log(wss)
        wss.clients.forEach(client => {
          client.send(data);
          
        });
       
      break;
      default: console.error('Unknown response type')
      break;
    }
  })

  wsParams.on('close', function (data) {
    console.log('client disconnect');
    console.log(nick + " disconnected")
    //console.log(wss.clients);
    //console.log(data);

    //users.body.forEach(user => {

    //})
    //перебрать пользователей foreach найти кто вышел и сделать олайн
   //обновить юзерз 
    wss.clients.forEach(client => {
      //client.send(JSON.stringify(users));
    });
  })
})