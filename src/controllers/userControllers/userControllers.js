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



export {
    applyVendor,
    getAllServices,
    getServiceById
}