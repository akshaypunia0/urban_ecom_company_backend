import express from 'express';
import { applyVendor, getAllServices, getServiceById } from '../../controllers/userControllers/userControllers.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import authorize from '../../middlewares/roleBasedAuthMiddleware.js';

const router = express.Router();

router.post('/vendor/apply', authMiddleware, authorize(['USER']), applyVendor);
router.get('/allservices', getAllServices);
router.get('/service/:id', getServiceById);

export default router;