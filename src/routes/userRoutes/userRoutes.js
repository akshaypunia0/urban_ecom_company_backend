import express from 'express';
import { applyVendor, getAllServices } from '../../controllers/userControllers/userControllers.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import authorize from '../../middlewares/roleBasedAuthMiddleware.js';

const router = express.Router();

router.post('/vendor/apply', authMiddleware, authorize(['USER']), applyVendor);
router.get('/allservices', authMiddleware, authorize(['USER', 'ADMIN']), getAllServices);

export default router;