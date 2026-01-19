
import { prisma } from "../../config/db.js";

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        const { password, ...rest } = allUsers;

        return res.status(200).json({
            message: allUsers.length > 0 ? "user fetched successfully" : "No user exist",
            allUsers
        })


    } catch (error) {
        return res.status(500).json({
            message: 'error getting all users'
        })
    }
}


const getAllVendors = async (req, res) => {
    try {
        const vendors = await prisma.vendor.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: vendors.length > 0 ? "success" : "no vendor exist",
            vendors
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error getting all vendors' })
    }
}


const approveVendor = async (req, res) => {
    try {

        const vendorId = req.params.id;

        let user = {}

        await prisma.$transaction(async (tx) => {

            const vendor = await tx.vendor.update({
                where: { id: vendorId },
                data: { status: 'APPROVED' }
            })

            user = await tx.user.update({
                where: { id: vendor.userId },
                data: { role: 'VENDOR' }
            })
        })

        return res.status(201).json({
            message: 'Vendor approved',
            user
        })

    } catch (error) {
        return res.status(500).json({ message: 'error while approving vendor' })
    }
}


const rejectVendor = async (req, res) => {
    try {

        const vendorId = req.params.id;

        await prisma.vendor.update({
            where: { id: vendorId },
            data: { status: 'REJECTED' }
        })

        return res.status(200).json({ message: 'Vendor application rejected' })

    } catch (error) {
        return res.status(500).json({ message: 'error while rejecting vendor' })
    }
}


const allOrders = async (req, res) => {
    try {

        const allOrder = await prisma.order.findMany({
            include: {
                vendor: {
                    select: {
                        company: true
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

        if (!Array.isArray(allOrder)) {
            return res.status(400).json({message: 'allorder fetching error'})
        }

        return res.status(200).json({
            message: allOrder.length > 0 ? 'all orders fetched successfully' : 'no order yet',
            allOrder
        })


    } catch (error) {
        return res.status(500).json({ message: 'error getting all orders' })
    }
}




export {
    getAllUsers,
    getAllVendors,
    approveVendor,
    rejectVendor,
    allOrders,
}