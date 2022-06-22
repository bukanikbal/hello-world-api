import mongoose from 'mongoose'

var Schema = mongoose.Schema
var ObjectId = mongoose.ObjectId


var User = new Schema({
  username : {
  	type : String
  },
  password : {
  	type : String
  },
  profile : {
  	type : ObjectId
  },
  isActive : {
  	type : Boolean
  },
  activeId : {
  	type : Number
  }
})

export default mongoose.model('User',User)


