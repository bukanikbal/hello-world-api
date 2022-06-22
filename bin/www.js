#!/usr/bin/env node

/**
 * Module dependencies.
 */

import mongoose from 'mongoose'
import {app} from '../app.js'
import {Server} from 'socket.io'
import {createServer} from 'http'
import {graphqlServer} from '../graphql/server.js'
import {message} from '../mongodb/models/Message.js'


mongoose.connection.on(
  'connected',
  onConnected
)

mongoose.connection.on(
  'disconnected',
  onDisconnected
)

var httpServer = createServer(app)


httpServer.on('error',onHttpError)
httpServer.on('listening',onListen)
httpServer.listen(process.env.PORT)


var socket = new Server(httpServer,{
  cors : {
    origin : '*'
  }
})



function onHttpError(error) {
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
  app.set(
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
      app:app,path
    })
  }
  catch(err){
    console.log(
      err
    )
  }
}

// connect db function

async function connectDb(uri){
  try{
    await  mongoose.connect(
      uri
    )
  }
  catch({message}){
    app.set('dbsErrorMessage',message);
    setTimeout(() => connectDb(),5000);
    console.log(`Reconnect:${message}`)
  } 
}

// on db connect

function onConnected(){
  app.set('connectedDatabase',true)
  console.log('connected to db server') 
  var MessageObserver = Message.watch()
  MessageObserver.on('change',(ch) => {
    var uniqueId = createUniqueId(
      ch.fullDocument.sender,
      ch.fullDocument.receiver
    )
    onMessageChange(
      uniqueId,
      ch.fullDocument
    )
  })
}

// on db disconnect

function onDisconnected(message){
  app.set('connectedDatabase',false);
  app.set('dbsErrorMessage','error');
  console.log('disconnected with db server');
}

// on socket connected with client

function onConnection(socket){

  socket.on('join',(_id) => {
    socket.join(_id)
    console.log(_id)
  })
 
  socket.on('test',(dst) => {
    socket.to(dst).emit('test')
  })

}

function onMessageChange(dst,docs){
  io.to(dst).emit(
    'message',
    docs
  )
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

