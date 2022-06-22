// import {Router} from 'express'

// var router = Router()

// router.get(
//   '/',
//   (req,res,next) => {
//   res.send('ok')
// })



// // router.post(
// //   '/',controller.new
// // )

// // router.put(
// //   '/',controller.up
// // )


// module.exports = router

import express from 'express'
import controller from '../controllers/message.js'


var router = express.Router()

router.get(
  '/',controller.all
)

router.get(
  '/recently/:id',
  controller.recently
)


export default router