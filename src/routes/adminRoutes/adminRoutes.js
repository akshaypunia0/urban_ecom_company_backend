import express from 'express';
import { getAllUsers, getAllVendors } from '../../controllers/adminControllers/adminControllers.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import authorize from '../../middlewares/roleBasedAuthMiddleware.js';

const router = express.Router();

router.get('/allUsers', authMiddleware, authorize(['ADMIN']), getAllUsers);
router.get('/allVendors', authMiddleware, authorize(['ADMIN']), getAllVendors);

export default router