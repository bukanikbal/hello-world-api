#!/usr/bin/env node

/**
 * Module dependencies.
 */

import {apps,connectDb} from '../app.js'
import {Server} from 'socket.io'
import {createServer} from 'http'
import {graphqlServer} from '../graphql/server.js'
import {message} from '../mongodb/models/Message.js'


var httpServer = createServer(apps);


var messageStream = message.watch();

httpServer.on('error',onServerErrr);
httpServer.on('listening',onListen);

httpServer.listen(process.env.PORT);


messageStream.on('change',(chg) => {
  onMessageChange(chg)
})


var socket = new Server(httpServer,{
  cors : {
    origin : '*'
  }
})
.on(
  'connect',
  onConnected
)

function onConnected(client){
  client.on('join',id => {
    client.join(id)
    console.log(id)
  })
}



// socket.on('connect',onSocketConnect)

// socket.on('connect',(client) => {
//   client.on('join',(id) => {
//     client.join(id)
//   })
// })



function onServerErrr(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'? 'Pipe ' + port: 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

async function onListen(){
  apps.set(
    'connectedDatabase',
    false
  )
  startGraphqlServer(
    '/'
  )
  connectDb(
    process.env.URI
  )
}

// graphql server function

async function startGraphqlServer(path){
  try{
    await graphqlServer.start()
    graphqlServer.applyMiddleware({
      app:apps,path
    })
  }
  catch(err){
    console.log(
      err
    )
  }
}

function onConnection(socket){

  socket.on('join',(_id) => {
    socket.join(_id)
    console.log(_id)
  })
 
  socket.on('test',(dst) => {
    socket.to(dst).emit('test')
  })

}

function onMessageChange(chg){
  switch(chg.operationType){
    case "insert": 
      onInsert(
       chg.fullDocument
      )
      break
  }
}

function onInsert({__v,...doc}){
  socket.to(doc.uniqueId)
  .emit('message',doc)
}

function strXArray(param,limiter){
  return param.split(limiter)
}

function _idFilter(_id){
  var number = [
    '1','2',
    '3','4',
    '5','6',
    '7','8',
    '9','0'
  ]

  var _Id = _id.filter((c) => {
    var [filter] = number.filter(
      (n) => n == c
    )

    return filter
  })

  return parseInt(_Id.join(''))
}

function createUniqueId(_id1,_id2){
  var _Id1 = _idFilter(strXArray(
    _id1.toString(),""
  ))
  var _Id2 = _idFilter(strXArray(
    _id2.toString(),""
  ))
    
  var _id = _Id1 + _Id2

  return _id.toString()
}

