import express from 'express'
import { markOrders } from '../../controllers/forOtherUse/dummyControllers.js'

const router = express.Router()


router.patch('/updateDummyOrder', markOrders)


export default router