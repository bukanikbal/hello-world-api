import User from '../mongodb/models/User.js'
import passport from 'passport'

export default{
  submit: async(req,res,next) => {
    if(req.app.get('connectedDatabase')){
      var [result] = await User.aggregate([
        {$match: {...req.body}},
        {$lookup: {
          from: 'profiles',
          localField: 'profile',
          foreignField: '_id',
          as: 'profile'
        }},
        {$unwind: {
          path: '$profile'
        }},
        {$project: {
          username: 0,
          password: 0,
          profile: {
            _id: 0
          }
        }}
      ])  
      
      if(result){
        res.status(200)
        .send(result)
      }
      else{
        res.status(404).send(
          'user not found'
        )
      }
    }
    else{
      res.status(500).send(
        'error network'
      )
    }
  },
  authenticate: (req,res,next) => {
    passport.authenticate('local',(err,user) => {
      if(err){
        res.status(err.status).send(
          err.message
        )
      }
      else{
        res.status(200).send(
          user
        )
      }
    })(req,res,next)
  }
}

