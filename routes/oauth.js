var express = require('express');
var router = express.Router();

var {authorize,getAuthUrl,getAccessToken} = require('../utils/service')(
  process.env.GOOGLE_OAUTH_CLIENT_ID,process.env.GOOGLE_OAUTH_CLIENT_SECRET,process.env.GOOGLE_OAUTH_REDIRECT_URI
)

router.get('/auth',(req,res,next) => {
  res.status(200).send(getAuthUrl(authorize()))
})

router.get('/token',async(req,res) => {
  try{
  	var token = await getAccessToken(
      authorize(),req.query.code
  	)
  	res.status(200).send(token)
  }
  catch({message}){
  	res.status(500).send(message)
  }
})

module.exports = router