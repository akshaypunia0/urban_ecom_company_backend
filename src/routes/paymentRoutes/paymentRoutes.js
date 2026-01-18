import express from 'express'
import { createOrder, confirmPaymentWebhook } from '../../controllers/razorpayControllers/razorpayControllers.js'
import authMiddleware from '../../middlewares/authMiddleware.js';
import authorize from '../../middlewares/roleBasedAuthMiddleware.js';

const router = express.Router()

router.post('/create-order', authMiddleware, authorize(['USER']), createOrder);
router.post('/razorpay', confirmPaymentWebhook);


export default router