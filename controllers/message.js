import mongoose from 'mongoose'
import Message from '../mongodb/models/Message.js'

var ObjectId = mongoose.Types.ObjectId;


export default {
  all : (req,res,next) => {
  	if(req.app.get('connectedDatabase')){
      var allMessages = Message.aggregate([
        {$match:{
          sender : {
            $in : [
              ObjectId(req.query.sender),
              ObjectId(req.query.receiver)
           ]
          },
          receiver : {
            $in : [
              ObjectId(req.query.receiver),
              ObjectId(req.query.sender)
            ]
          }
        }}
      ])

      allMessages.then((result) => {
        res.status(200).send(
          result
        )
      })
      .catch(({message}) => {
        res.status(500)
        .send(message)
      })
      
  	}
  	else{
  	  res.status(500).send(
        req.app.get('error network')
      )
  	}
  },
  recently : async(req,res,next) => {
  	if(req.app.get('connectedDatabase')){
      var result = await Message.aggregate([
        {$match: {
          $or: [
            {sender: ObjectId(
              req.params._id
            )},
            {receiver: ObjectId(
              req.params._id
            )}
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
        {$group: {
          message : {
          	$max: '$$ROOT'
          }
        }}
      ])

      res.status(200).send(result)
  	}
  	else{
  	  res.status(500).send(
        'error network'
  	  )
  	}
  },
  new : async(req,res,next) => {
    if(req.app.get('connectedDbs')){
    	var message = new Message(req.body)
    	try{
        var result = await message.save()
    		res.status(200).send(result)
    	}
    	catch(err){
    		res.status(500).send(err.message)
    	}
    }
    else{
    	res.status(500).send(
        req.app.get('errMessage')
    	)
    }
  },
  up : async(req,res,next) => {
    if(req.app.get('connectedDbs')){
      try{
        var result = await Message.findOneAndUpdate(
          req.body,{last:false}
        )
        res.status(200).send(result)
      }
      catch(err){
        res.status(500).send(err.message)
      }
    }
    else{
      res.status(500).send(
        req.app.get('errMessage')
      )
    }
    
  }
}