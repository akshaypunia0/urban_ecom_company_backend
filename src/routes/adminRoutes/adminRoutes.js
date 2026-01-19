import express from 'express';
import { getAllUsers, getAllVendors, approveVendor, rejectVendor, allOrders } from '../../controllers/adminControllers/adminControllers.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import authorize from '../../middlewares/roleBasedAuthMiddleware.js';

const router = express.Router();

router.get('/allUsers', authMiddleware, authorize(['ADMIN']), getAllUsers);
router.get('/allVendors', authMiddleware, authorize(['ADMIN']), getAllVendors);
router.get('/allOrders', authMiddleware, authorize(['ADMIN']), allOrders);
router.patch('/approveVendor/:id', authMiddleware, authorize(['ADMIN']), approveVendor);
router.patch('/rejectVendor/:id', authMiddleware, authorize(['ADMIN']), rejectVendor);

export default router