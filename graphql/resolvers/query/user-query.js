import * as ase from 'apollo-server-express'
import User from '../../../mongodb/models/User.js'

export default {
  auth  : async (parent,args,ctx) => {
  	if(ctx.app.get('connectedDatabase')){
      var [result] = await User.aggregate([
        {$match: args},
        {$lookup : {
          from : 'profiles',
          localField:'profile',
          foreignField:'_id',
          as:'profile'
        }},
        {$unwind:{
          path:'$profile'
        }}
      ])

      if(result){
        return result
      }
      else{
        throw new ase.AuthenticationError(
          'User not found'
        )
      }
    }
    else{
      throw new ase.ApolloError(
        ctx.app.get('dbsErrorMessage')
      )
    }
  },
  search: async (parent,args,ctx) => {
    if(ctx.app.get('connectedDatabase')){
      var user = await User.aggregate([
        {$lookup: {
          from: 'profiles',
          localField: 'profile',
          foreignField: '_id',
          as: 'profile'
        }},
        {$unwind: {
          path: '$profile'
        }},
        {$match: {
          $or : [
            {"profile.firstName":args.query},
            {"profile.lastName":args.query}
          ]
        }}
      ])
      return user
    }
    else{
      throw new ase.ApolloError(
        ctx.app.get('dbsErrorMessage')
      )
    }
  }
}