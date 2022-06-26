import mongoose from 'mongoose'

var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

var Message = new Schema({
  _id : {
    type : ObjectId
  },
  sender : {
  	type : ObjectId
  },
  receiver : {
  	type : ObjectId
  },
  content : {
  	type : Object,
  },
  uniqueId : {
    type: String
  },
  read: Boolean
})

var message = mongoose.model(
  'Message',Message
)

export {message}


