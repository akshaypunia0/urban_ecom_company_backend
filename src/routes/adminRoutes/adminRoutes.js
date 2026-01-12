import express from 'express';
import { getAllUsers } from '../../controllers/adminControllers/adminControllers.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import authorize from '../../middlewares/roleBasedAuthMiddleware.js';

const router = express.Router();

console.log("Authorize is: ", authorize);


router.get('/allUsers', authMiddleware, authorize(['ADMIN']), getAllUsers)

export default router