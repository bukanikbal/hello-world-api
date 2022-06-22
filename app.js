import url from 'url'
import path from 'path'
import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import mongoose from 'mongoose'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'

var apps = express();

apps.use(morgan('dev'))
apps.use(express.json())
apps.use(cookieParser())

mongoose.connection.on(
  'connected',
  onConnected
)

mongoose.connection.on(
  'disconnected',
  onDisconnected
)

function onConnected(){
  apps.set('connectedDatabase',true)
  console.log('connected with db..') 
}

function onDisconnected(){
  apps.set('connectedDatabase',false);
  apps.set('dbsErrorMessage','error');
  console.log('disconncted from db.');
}

async function connectDb(uri){
  try{
    await  mongoose.connect(
      uri
    )
  }
  catch({message}){
    apps.set('dbsErrorMessage',message);
    setTimeout(() => connectDb(),10000);
    console.log(`Reconnect: ${message}`)
  }
}


apps.use(
  cors({
	origin:'*'
  })
)


apps.use(
  express.urlencoded({
	extended: false 
  })
);


apps.use(
  express.static(
  	path.join(
  	  path.dirname(
  	  	url.fileURLToPath(import.meta.url)
  	  ), 
  	  'public'
  	)
  )
);


export {apps,connectDb}
