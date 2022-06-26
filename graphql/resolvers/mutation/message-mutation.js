import * as apollo from 'apollo-server-express'
import {message} from '../../../mongodb/models/Message.js'



export default {
  new : async(parent,args,ctx) =>{
  	var conn = ctx.app.get(
      'connectedDatabase'
  	)
  	if(conn){
      var newer = new message(args.param)
      var newMessage = await newer.save()
      
      return newMessage
  	}
  	else{
  	  throw new apollo.ApolloError(
        ctx.app.get('dbsErrorMessage')
  	  )
  	}
  },
  read : async(parent,args,ctx) => {
    var conn = ctx.app.get(
      'connectedDatabase'
    )
    if(conn){
      try{
        var result = await message.findByIdAndUpdate(
          args.param._id,
          args.param.update,
          args.param.options
        )

        return result
      }
      catch(err){
        throw new apollo.ApolloError(
          err.message
        )
      }
    }
    else{
      throw new apollo.ApolloError(
        ctx.app.get('dbsErrorMessage')
      )
    }
  }
}