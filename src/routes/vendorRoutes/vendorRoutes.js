import { Router } from 'express'
import { createService, allServices, serviceById, upadteSingleService, deleteServiceById, myAllOrders, myAllPaidOrders, acceptPaidOrder, completeOrder } from '../../controllers/vendorControllers/vendorControllers.js'
import authMiddleware from '../../middlewares/authMiddleware.js';
import authorize from '../../middlewares/roleBasedAuthMiddleware.js';

const router = Router();

router.post('/createService', authMiddleware, authorize(['VENDOR']), createService)
router.get('/myServices', authMiddleware, authorize(['VENDOR']), allServices)
router.get('/service/:id', authMiddleware, authorize(['VENDOR']), serviceById)
router.patch('/updateService/:id', authMiddleware, authorize(['VENDOR']), upadteSingleService)
router.delete('/deleteService/:id', authMiddleware, authorize(['VENDOR']), deleteServiceById)
router.get('/myAllOrders', authMiddleware, authorize(['VENDOR']), myAllOrders)
router.get('/myAllPaidOrders', authMiddleware, authorize(['VENDOR']), myAllPaidOrders)
router.patch('/acceptOrder/:id', authMiddleware, authorize(['VENDOR']), acceptPaidOrder)
router.patch('/completeOrder/:id', authMiddleware, authorize(['VENDOR']), completeOrder)



export default router