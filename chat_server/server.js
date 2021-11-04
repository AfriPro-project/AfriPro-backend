const server = require('http').createServer();
const io = require('socket.io')(server);

const {get,post} = require('./utils/api');

io.on('connection', client => {
  console.log('connected');


  //join a room
  client.on('joinRoom',(roomId)=>{
    if(client.rooms.has(roomId) == false){
      client.join(roomId);
      console.log(client.id+' joined room '+roomId);
    }
  })

  //leave room
  client.on('leaveRoom',(roomId)=>{
    client.leave(roomId);
    console.log('user left '+roomId);
  })

  //emit message to room
  client.on('sendMessage',(message)=>{
    var roomId = parseInt(message.message.room_id);
    client.broadcast.to(roomId).emit('message', message.message);
  })

  //send message to all room uesrs
  client.on('broadcast',({roomId, message})=>{
    io.to(roomId).emit('message', message.message);
  })


  client.on('setSeen',({id,roomId})=>{
    client.broadcast.to(roomId).emit('seen', id);
  })

  //get user messages
  // client.on('getLatestMessages',async(user_id)=>{
  //     try{
  //       var response = await get(`/chatrooms/messages/latest`);
  //       client.emit("latestMessages",response);
  //     }catch(e){
  //       console.log(e);
  //     }
  // })

});
server.listen(3000);
