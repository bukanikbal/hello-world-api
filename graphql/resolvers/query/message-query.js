import mongoose from 'mongoose'
import * as ase from 'apollo-server-express'
import {message} from '../../../mongodb/models/Message.js'

var ObjId = mongoose.Types.ObjectId;


export default {
  all : async (parent,args,ctx) => {
    if(ctx.app.get('connectedDatabase')){
      var result = await message.aggregate([     
        {$match:{
          sender : {
            $in : [
              ObjId(args.sender),
              ObjId(args.receiver)
           ]
          },
          receiver : {
            $in : [
              ObjId(args.receiver),
              ObjId(args.sender)
            ]
          }
        }},
        {$addFields:{
          send: true
        }}
      ])
      return result
    }
    else{
      throw new ase.ApolloError(
        ctx.app.get('dbsErrorMessage')
      )
    }
  },
  recently: async(parent,args,ctx) => {
    if(ctx.app.get('connectedDatabase')){
      var result = await message.aggregate([
        {$match: {
          $or: [
            {sender: ObjId(args._id)},
            {receiver: ObjId(args._id)}
          ],
        }},
        {$lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: "_id",
          as: 'sender'
        }},
        {$lookup: {
          from: 'users',
          localField: 'receiver',
          foreignField: "_id",
          as: 'receiver'
        }},
        {$unwind: {
          path: '$sender'
        }},
        {$unwind: {
          path: '$receiver'
        }},
        {$lookup: {
          from: 'profiles',
          localField:'sender.profile',
          foreignField:'_id',
          as: 'sender.profile'
        }},
        {$lookup: {
          from: 'profiles',
          localField:'receiver.profile',
          foreignField:'_id',
          as: 'receiver.profile'
        }},
        {$unwind: {
          path: '$sender.profile'
        }},
        {$unwind: {
          path: '$receiver.profile'
        }},
        {$group:{
          _id: "$uniqueId",
          "detail": {
            $max: "$$ROOT"
          }
        }},
        {$replaceRoot:{
          newRoot: "$detail"
        }}
      ])

      return result
    }
    else{
    	throw new ase.ApolloError(
        ctx.app.get('dbsErrorMessage')
      )
    }
  }
}