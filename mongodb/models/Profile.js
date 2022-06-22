import mongoose from 'mongoose'

var Schema = mongoose.Schema

var Profile = new Schema({
  picture : {
  	type : String
  },
  fullName : {
  	type : String
  },
})

export default mongoose.model('Profile',Profile)