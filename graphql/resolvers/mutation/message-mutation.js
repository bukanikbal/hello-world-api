import * as apollo from 'apollo-server-express'
import Message from '../../../mongodb/models/Message.js'



export default {
  new : async(parent,args,ctx) =>{
  	var conn = ctx.app.get(
      'connectedDatabase'
  	)
  	if(conn){
      var newer = new Message(args.param)
      var newMessage = await newer.save()
      
      return newMessage
  	}
  	else{
  	  throw new apollo.ApolloError(
        ctx.app.get('dbsErrorMessage')
  	  )
  	}
  } 
}