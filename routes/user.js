import express from 'express'
import controller from '../controllers/user.js'

var router = express.Router()

router.post(
  '/',controller.authenticate
)

router.post(
  '/submit',controller.submit
)

export default router