
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
            data: { status: 'REJECTED'}
        })

        return res.status(200).json({message: 'Vendor application rejected'})

    } catch (error) {
        return res.status(500).json({message: 'error while rejecting vendor'})
    }
}



export {
    getAllUsers,
    getAllVendors,
    approveVendor,
    rejectVendor
}