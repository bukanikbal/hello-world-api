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

messageStream.on('change',onMsgChg);

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
  client.on('join',ids => {
    ids.map(_id => {
      client.join(
        _id
      )
      console.log(
        _id
      )
    })
  })
}

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
      app:apps,path:'/'
    })
  }
  catch(err){
    console.log(
      err
    )
  }
}

function onMsgChg(chg){
  switch(chg.operationType){
    case "insert": 
      onMessageInsert(
        chg.fullDocument
      ) 
      break
    case "update" : 
      onMessageUpdate(
        chg
      )
      break
  }
}

function onMessageInsert(doc){
  notifyForNewMessage(
    doc.uniqueId,
    doc
  )
}

function onMessageUpdate(doc){
  notifyForMessageUpdate(
    doc.documentKey
  )
}

function notifyForNewMessage(dst,doc){
  socket.to(dst).emit('message',doc)
}

async function notifyForMessageUpdate({_id}){
  socket.emit('messageUpdate',_id)
}
