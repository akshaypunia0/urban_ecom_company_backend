import { prisma } from "../../config/db.js";


const createService = async (req, res) => {

    if (req.body === undefined) {
        return res.status(400).json({ message: 'request body is undefined: please provide title and price for service' })
    }

    try {

        const { title, price } = req.body;

        if (req.body === undefined || !title || !price) {
            return res.status(400).json({ message: 'please provide title and price for service' })
        }

        const vendor = await prisma.vendor.findUnique({
            where: {
                userId: req.user.id
            }
        })

        if (!vendor) {
            return res.status(400).json({ message: 'only veddor can create service' })
        }


        const existingService = await prisma.service.findFirst({
            where: {
                vendorId: vendor.id,
                title
            }
        });

        if (existingService) {
            return res.status(400).json({ message: 'you have already created this service' })
        }

        const service = await prisma.service.create({
            data: {
                vendorId: vendor.id,
                title,
                price
            }
        })

        return res.status(201).json({
            message: 'service created',
            service
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'error while creating service' })
    }
}


const allServices = async (req, res) => {
    try {

        const services = await prisma.service.findMany({
            where: {
                vendor: { userId: req.user.id }
            }
        })

        return res.status(200).json({
            message: 'services fetched successfully',
            services
        })

    } catch (error) {
        return res.status(500).json({ message: 'error while getting your all services' })
    }
}


const serviceById = async (req, res) => {
    try {

        const serviceId = req.params.id;

        const service = await prisma.service.findUnique({
            where: {
                id: serviceId,
                vendor: { userId: req.user.id }
            }
        })

        if (!service) {
            return res.status(400).json({ message: 'service not found' })
        }

        return res.status(200).json({
            message: 'service fetched successfully',
            service
        })

    } catch (error) {
        return res.status(500).json({ message: 'error while getting data of this service' })
    }
}


const upadteSingleService = async (req, res) => {

    if (!req.body || req.body === undefined) {
        return res.status(400).json({ message: 'request body undefined: title or price needed for update' })
    }

    try {

        const serviceId = req.params.id;
        const { title, price } = req.body;

        const existingService = await prisma.service.findFirst({
            where: {
                id: serviceId,
                vendor: { userId: req.user.id }
            }
        })

        if (!existingService) {
            return res.status(400).json({ message: 'service not exist' })
        }

        const updatedService = await prisma.service.update({
            where: {
                id: serviceId
            },
            data: {
                ...(title !== undefined && { title }),
                ...(price !== undefined && { price })
            }
        })

        return res.status(200).json({
            message: 'service updated',
            updatedService
        })

    } catch (error) {
        return res.status(500).json({ message: 'error while updating service' })
    }
}


const deleteServiceById = async (req, res) => {

    try {

        const serviceId = req.params.id

        const existingService = await prisma.service.findFirst({
            where: {
                id: serviceId,
                vendor: {
                    userId: req.user.id
                }
            }
        })

        if (!existingService) {
            return res.status(400).json({ message: 'service not found to delete' })
        }

        const deletedService = await prisma.service.delete({
            where: { id: serviceId }
        })

        return res.status(200).json({
            message: 'service deleted successfully',
            deletedService
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'error while deleting this service' })
    }
}


const myAllOrders = async (req, res) => {
    try {

        const allOrders = await prisma.order.findMany({
            where: {
                vendor: {
                    userId: req.user.id
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                service: {
                    select: {
                        title: true,
                        price: true
                    }
                }
            }
        })

        return res.status(200).json({
            message: allOrders.length > 0 ? 'orders fetched successfully' : 'no order yet',
            allOrders
        })

    } catch (error) {
        return res.status(500).json({ message: 'error while fetching all your orders' })
    }
}


const myAllPaidOrders = async (req, res) => {
    try {

        const allPaidOrders = await prisma.order.findMany({
            where: {
                vendor: {
                    userId: req.user.id
                },
                ordStatus: 'PAID'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                service: {
                    select: {
                        title: true,
                        price: true
                    }
                }
            }
        })

        return res.status(200).json({
            message: allPaidOrders.length > 0 ? 'orders fetched successfully' : 'no paid orders yet',
            allPaidOrders
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'error while getting all paid orders' })
    }
}


const acceptPaidOrder = async (req, res) => {
    try {

        const orderId = req.params.id;

        const verifyOrder = await prisma.order.findFirst({
            where: {
                id: orderId,
                vendor: {
                    userId: req.user.id
                }
            }
        })

        if (!verifyOrder) {
            return res.status(403).json({ message: 'You are not authorized to accept this order' })
        }

        if (verifyOrder.ordStatus === 'ACCEPTED') {
            return res.status(400).json({ message: 'Order already accepted' })
        }

        if (verifyOrder.ordStatus !== 'PAID') {
            return res.status(400).json({ message: 'unpaid order: can not accept' })
        }

        const acceptedOrder = await prisma.order.update({
            where: {
                id: orderId,
                ordStatus: 'PAID'
            },
            data: {
                ordStatus: 'ACCEPTED'
            }
        })

        if (!acceptedOrder) {
            return res.status(400).json({
                message: 'Order could not be accepted'
            });
        }

        return res.status(200).json({
            message: 'order accepted',
            acceptedOrder
        })



    } catch (error) {
        return res.status(500).json({ message: 'error while acepting order' })
    }
}


const completeOrder = async (req, res) => {
    try {

        const orderId = req.params.id

        const verifyOrder = await prisma.order.findFirst({
            where: {
                id: orderId,
                vendor: {
                    userId: req.user.id
                }
            }
        })

        if (!verifyOrder) {
            return res.status(403).json({ message: 'order do not exist or You are not authorized to complete this order' })
        }

        if (verifyOrder.ordStatus !== 'ACCEPTED') {
            return res.status(400).json({ message: 'this order was not accepted' })
        }

        const completedOrder = await prisma.order.update({
            where: {
                id: orderId,
                ordStatus: 'ACCEPTED'
            },
            data: {
                ordStatus: 'COMPLETED'
            }
        })

        if (!completedOrder) {
            return res.status(400).json({ message: 'order cound not be completed' })
        }

        return res.status(200).json({
            message: 'order completed',
            completedOrder
        })


    } catch (error) {
        return res.status(500).json({ message: 'error while updated order as COMPLETE' })
    }
}





export {
    createService,
    allServices,
    serviceById,
    upadteSingleService,
    deleteServiceById,
    myAllOrders,
    myAllPaidOrders,
    acceptPaidOrder,
    completeOrder
}