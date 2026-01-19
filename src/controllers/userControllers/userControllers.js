import { prisma } from "../../config/db.js";

const applyVendor = async (req, res) => {

    try {

        if (!req.body) {
            return res.status(400).json({ message: 'Request body missing: please provide company name' });
        }

        const userId = req.user.id;
        const { company } = req.body;


        if (!company) {
            return res.status(400).json({ message: 'please provide your company name' })
        }

        const existingVendor = await prisma.vendor.findUnique({
            where: { userId }
        });

        if (existingVendor) {
            return res.status(400).json({ message: 'already applied' })
        };

        const vendor = await prisma.vendor.create({
            data: {
                userId,
                company
            }
        })

        return res.status(201).json({
            status: 'success',
            message: 'Vendor application submitted',
            vendor
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'something went wrong while applying for verdor' })
    }
}


const getAllServices = async (req, res) => {
    try {
        const allServices = await prisma.service.findMany({
            where: { active: true },
            include: {
                vendor: {
                    select: {
                        company: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        return res.status(200).json({
            message: 'services fetched successsfully',
            allServices
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'error while getting all services' })
    }
}


const getServiceById = async (req, res) => {

    try {

        const serviceId = req.params.id

        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: {
                vendor: {
                    select: {
                        company: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
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
        return res.status(500).json({ message: 'error while getting this service' })
    }
}


const getAllOrder = async (req, res) => {
    try {

        const allOrders = await prisma.order.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                vendor: {
                    select: {
                        company: true,
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


        if (!Array.isArray(allOrders)) {
            return res.status(400).json({ message: 'error getting orders list' })
        }

        return res.status(200).json({
            message: allOrders.length > 0 ? 'orders fetched succcessfully' : 'no orders yet',
            allOrders
        })

    } catch (error) {
        return res.status(500).json({ message: 'error while getting all orders by a user' })
    }
}


const getOrderById = async (req, res) => {
    try {

        const orderId = req.params.id

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: req.user.id
            },
            include: {
                vendor: {
                    select: {
                        company: true,
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

        if(!order) {
            return res.status(400).json({message: 'you are not authorized to get this order detail or you have not placed this order'})
        }

        return res.status(200).json({
            message: 'order detail fetched successfuly',
            order
        })

    } catch (error) {
        return res.status(500).json({ message: 'error getting single order' })
    }
}





export {
    applyVendor,
    getAllServices,
    getServiceById,
    getAllOrder,
    getOrderById,
}