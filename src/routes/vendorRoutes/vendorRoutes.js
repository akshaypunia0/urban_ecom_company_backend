import { Router } from 'express'
import { createService, allServices, serviceById, upadteSingleService, deleteServiceById, myAllOrders } from '../../controllers/vendorControllers/vendorControllers.js'
import authMiddleware from '../../middlewares/authMiddleware.js';
import authorize from '../../middlewares/roleBasedAuthMiddleware.js';

const router = Router();

router.post('/createService', authMiddleware, authorize(['VENDOR']), createService)
router.get('/myServices', authMiddleware, authorize(['VENDOR']), allServices)
router.get('/service/:id', authMiddleware, authorize(['VENDOR']), serviceById)
router.patch('/updateService/:id', authMiddleware, authorize(['VENDOR']), upadteSingleService)
router.delete('/deleteService/:id', authMiddleware, authorize(['VENDOR']), deleteServiceById)
router.get('/myAllOrders', authMiddleware, authorize(['VENDOR']), myAllOrders)



export default router