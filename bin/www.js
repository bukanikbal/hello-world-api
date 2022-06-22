#!/usr/bin/env node

/**
 * Module dependencies.
 */

import http from 'http'
import app from '../app.js'
import mongoose from 'mongoose'
import server from '../graphql/server.js'
import Message from '../mongodb/models/Message.js'
import * as socket from 'socket.io'


var port = normalizePort(process.env.PORT);

var httpServer = http.createServer(app)


var io = new socket.Server(httpServer,{
  cors : {
    origin: '*'
  }
})

httpServer.listen(port);
httpServer.on('error',onError);
httpServer.on('listening',onListening)

mongoose.connection.on('connected',onConnected)
mongoose.connection.on('disconnected',onDisconnected)

io.on('connection',onConnection)

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

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

async function onListening(){
  // app.set('connectedDatabase',false)
  // graphqlServer()
  // connectDb()
}

// graphql server function

async function graphqlServer(){
  try{
    await server.start()
    server.applyMiddleware({
      app:app,path:'/test'
    })
  }
  catch(err){
    console.log(
      err
    )
  }
}

// connect db function

async function connectDb(){
  try{
    await  mongoose.connect(
      process.env.URI
    )
  }
  catch({message}){
    app.set('dbsErrorMessage',message);
    setTimeout(() => connectDb(),5000);
    console.log(`Reconnect,${message}`)
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

